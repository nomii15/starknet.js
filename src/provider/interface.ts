import type {
  AddTransactionResponse,
  CallContractResponse,
  CallContractTransaction,
  CompiledContract,
  GetBlockResponse,
  GetCodeResponse,
  GetContractAddressesResponse,
  GetTransactionResponse,
  GetTransactionStatusResponse,
  Transaction,
} from '../types';
import type { BigNumberish } from '../utils/number';

export abstract class ProviderInterface {
  public abstract baseUrl: string;

  public abstract feederGatewayUrl: string;

  public abstract gatewayUrl: string;

  /**
   * Gets the smart contract address on the goerli testnet.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L13-L15)
   * @returns starknet smart contract addresses
   */
  public abstract getContractAddresses(): Promise<GetContractAddressesResponse>;

  /**
   * Calls a function on the StarkNet contract.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L17-L25)
   *
   * @param invokeTx - transaction to be invoked
   * @param blockId
   * @returns the result of the function on the smart contract.
   */
  public abstract callContract(
    invokeTx: CallContractTransaction,
    blockId?: number
  ): Promise<CallContractResponse>;

  /**
   * Gets the block information from a block ID.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L27-L31)
   *
   * @param blockId
   * @returns the block object { block_id, previous_block_id, state_root, status, timestamp, transaction_receipts, transactions }
   */
  public abstract getBlock(blockId?: number): Promise<GetBlockResponse>;

  /**
   * Gets the code of the deployed contract.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L33-L36)
   *
   * @param contractAddress
   * @param blockId
   * @returns Bytecode and ABI of compiled contract
   */
  public abstract getCode(contractAddress: string, blockId?: number): Promise<GetCodeResponse>;

  // TODO: add proper type
  /**
   * Gets the contract's storage variable at a specific key.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L38-L46)
   *
   * @param contractAddress
   * @param key - from getStorageVarAddress('<STORAGE_VARIABLE_NAME>') (WIP)
   * @param blockId
   * @returns the value of the storage variable
   */
  public abstract getStorageAt(
    contractAddress: string,
    key: number,
    blockId?: number
  ): Promise<object>;

  /**
   * Gets the status of a transaction.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L48-L52)
   *
   * @param txHash
   * @returns the transaction status object { block_id, tx_status: NOT_RECEIVED | RECEIVED | PENDING | REJECTED | ACCEPTED_ONCHAIN }
   */
  public abstract getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse>;

  /**
   * Gets the transaction information from a tx id.
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/feeder_gateway/feeder_gateway_client.py#L54-L58)
   *
   * @param txHash
   * @returns the transacton object { transaction_id, status, transaction, block_id?, block_number?, transaction_index?, transaction_failure_reason? }
   */
  public abstract getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse>;

  /**
   * Invoke a function on the starknet contract
   *
   * [Reference](https://github.com/starkware-libs/cairo-lang/blob/f464ec4797361b6be8989e36e02ec690e74ef285/src/starkware/starknet/services/api/gateway/gateway_client.py#L13-L17)
   *
   * @param tx - transaction to be invoked
   * @returns a confirmation of invoking a function on the starknet contract
   */
  public abstract addTransaction(tx: Transaction): Promise<AddTransactionResponse>;

  /**
   * Deploys a given compiled contract (json) to starknet
   *
   * @param contract - a json object containing the compiled contract
   * @param address - (optional, defaults to a random address) the address where the contract should be deployed (alpha)
   * @returns a confirmation of sending a transaction on the starknet contract
   */
  public abstract deployContract(
    contract: CompiledContract | string,
    constructorCalldata: string[],
    addressSalt: BigNumberish
  ): Promise<AddTransactionResponse>;

  /**
   * Invokes a function on starknet
   *
   * @param contractAddress - target contract address for invoke
   * @param entrypointSelector - target entrypoint selector for
   * @param calldata - (optional, default []) calldata
   * @param signature - (optional) signature to send along
   * @returns response from addTransaction
   */
  public abstract invokeFunction(
    contractAddress: string,
    entrypointSelector: string,
    calldata?: string[],
    signature?: [BigNumberish, BigNumberish]
  ): Promise<AddTransactionResponse>;

  public abstract waitForTx(txHash: BigNumberish, retryInterval?: number): Promise<void>;
}
