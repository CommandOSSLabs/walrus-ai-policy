// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { GraphQLClient } from "graphql-request";
import type { RequestInit } from "graphql-request/dist/types.dom";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit["headers"],
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    });
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Base64: { input: string; output: string };
  BigInt: { input: string; output: string };
  DateTime: { input: string; output: string };
  JSON: { input: unknown; output: unknown };
  MoveTypeLayout: { input: unknown; output: unknown };
  MoveTypeSignature: { input: unknown; output: unknown };
  OpenMoveTypeSignature: { input: unknown; output: unknown };
  SuiAddress: { input: string; output: string };
  UInt53: { input: number; output: number };
};

/** System transaction for creating the accumulator root. */
export type SuiAccumulatorRootCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

export type SuiActiveJwk = {
  /** The JWK algorithm parameter, (RFC 7517, Section 4.4). */
  alg?: Maybe<Scalars["String"]["output"]>;
  /** The JWK RSA public exponent, (RFC 7517, Section 9.3). */
  e?: Maybe<Scalars["String"]["output"]>;
  /** The most recent epoch in which the JWK was validated. */
  epoch?: Maybe<SuiEpoch>;
  /** The string (Issuing Authority) that identifies the OIDC provider. */
  iss?: Maybe<Scalars["String"]["output"]>;
  /** The string (Key ID) that identifies the JWK among a set of JWKs, (RFC 7517, Section 4.5). */
  kid?: Maybe<Scalars["String"]["output"]>;
  /** The JWK key type parameter, (RFC 7517, Section 4.1). */
  kty?: Maybe<Scalars["String"]["output"]>;
  /** The JWK RSA modulus, (RFC 7517, Section 9.3). */
  n?: Maybe<Scalars["String"]["output"]>;
};

export type SuiActiveJwkConnection = {
  /** A list of edges. */
  edges: Array<SuiActiveJwkEdge>;
  /** A list of nodes. */
  nodes: Array<SuiActiveJwk>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiActiveJwkEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiActiveJwk;
};

export type SuiAddress = SuiIAddressable &
  SuiNode & {
    /** The Address' identifier, a 32-byte number represented as a 64-character hex string, with a lead "0x". */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /** Attempts to fetch the object at this address. */
    asObject?: Maybe<SuiObject>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * Returns `None` when no checkpoint is set in scope (e.g. execution scope).
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /**
     * Access a dynamic field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic field with that name could not be found attached to the object with this address.
     */
    dynamicField?: Maybe<SuiDynamicField>;
    /**
     * Dynamic fields owned by this address.
     *
     * The address must correspond to an object (account addresses cannot own dynamic fields), but that object may be wrapped.
     */
    dynamicFields?: Maybe<SuiDynamicFieldConnection>;
    /**
     * Access a dynamic object field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic object field with that name could not be found attached to the object with this address.
     */
    dynamicObjectField?: Maybe<SuiDynamicField>;
    /** The address's globally unique identifier, which can be passed to `Query.node` to refetch it. */
    id: Scalars["ID"]["output"];
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * Returns `None` when no checkpoint is set in scope (e.g. execution scope).
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Access dynamic fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Access dynamic object fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
    /** Objects owned by this address, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /**
     * Transactions associated with this address.
     *
     * Similar behavior to the `transactions` in Query but supporting the additional `AddressTransactionRelationship` filter, which defaults to `SENT`.
     */
    transactions?: Maybe<SuiTransactionConnection>;
  };

export type SuiAddressAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiAddressBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

export type SuiAddressBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiAddressDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

export type SuiAddressDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiAddressDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

export type SuiAddressMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

export type SuiAddressMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

export type SuiAddressMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

export type SuiAddressObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiAddressTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
  relation?: InputMaybe<SuiAddressTransactionRelationship>;
};

/** System transaction for creating the alias state. */
export type SuiAddressAliasStateCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/**
 * Identifies a specific version of an address.
 *
 * Exactly one of `address` or `name` must be specified. Additionally, at most one of `rootVersion` or `atCheckpoint` can be specified. If neither bound is provided, the address is fetched at the checkpoint being viewed.
 *
 * See `Query.address` for more details.
 */
export type SuiAddressKey = {
  /** The address. */
  address?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  /** If specified, sets a checkpoint bound for this address. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** A SuiNS name to resolve to an address. */
  name?: InputMaybe<Scalars["String"]["input"]>;
  /** If specified, sets a root version bound for this address. */
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** Object is exclusively owned by a single address, and is mutable. */
export type SuiAddressOwner = {
  /** The owner's address. */
  address?: Maybe<SuiAddress>;
};

/** The possible relationship types for a transaction: sent or affected. */
export enum SuiAddressTransactionRelationship {
  /** Transactions that this address was involved in, either as the sender, sponsor, or as the owner of some object that was created, modified or transferred. */
  Affected = "AFFECTED",
  /** Transactions this address has sent. */
  Sent = "SENT",
}

/** System transaction for creating the on-chain state used by zkLogin. */
export type SuiAuthenticatorStateCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** System transaction that is executed at the end of an epoch to expire JSON Web Keys (JWKs) that are no longer valid, based on their associated epoch. This is part of the on-chain state management for zkLogin and authentication. */
export type SuiAuthenticatorStateExpireTransaction = {
  /** The initial version that the AuthenticatorStateUpdate was shared at. */
  authenticatorObjInitialSharedVersion?: Maybe<Scalars["UInt53"]["output"]>;
  /** Expire JWKs that have a lower epoch than this. */
  minEpoch?: Maybe<SuiEpoch>;
};

export type SuiAuthenticatorStateUpdateTransaction = {
  /** The initial version of the authenticator object that it was shared at. */
  authenticatorObjInitialSharedVersion?: Maybe<Scalars["UInt53"]["output"]>;
  /** Epoch of the authenticator state update transaction. */
  epoch?: Maybe<SuiEpoch>;
  /** Newly active JWKs (JSON Web Keys). */
  newActiveJwks?: Maybe<SuiActiveJwkConnection>;
  /** Consensus round of the authenticator state update. */
  round?: Maybe<Scalars["UInt53"]["output"]>;
};

export type SuiAuthenticatorStateUpdateTransactionNewActiveJwksArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Checkpoint range for which data is available. */
export type SuiAvailableRange = {
  /** Inclusive lower checkpoint for which data is available. */
  first?: Maybe<SuiCheckpoint>;
  /** Inclusive upper checkpoint for which data is available. */
  last?: Maybe<SuiCheckpoint>;
};

/** The total balance for a particular coin type. */
export type SuiBalance = {
  /** The balance as tracked by the accumulator object for the address. */
  addressBalance?: Maybe<Scalars["BigInt"]["output"]>;
  /** Total balance across all owned coin objects of the coin type. */
  coinBalance?: Maybe<Scalars["BigInt"]["output"]>;
  /** Coin type for the balance, such as `0x2::sui::SUI`. */
  coinType?: Maybe<SuiMoveType>;
  /** The sum total of the accumulator balance and individual coin balances owned by the address. */
  totalBalance?: Maybe<Scalars["BigInt"]["output"]>;
};

/** Effects to the balance (sum of coin values per coin type) of addresses and objects. */
export type SuiBalanceChange = {
  /** The signed balance change. */
  amount?: Maybe<Scalars["BigInt"]["output"]>;
  /** The inner type of the coin whose balance has changed (e.g. `0x2::sui::SUI`). */
  coinType?: Maybe<SuiMoveType>;
  /** The address or object whose balance has changed. */
  owner?: Maybe<SuiAddress>;
};

export type SuiBalanceChangeConnection = {
  /** A list of edges. */
  edges: Array<SuiBalanceChangeEdge>;
  /** A list of nodes. */
  nodes: Array<SuiBalanceChange>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiBalanceChangeEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiBalanceChange;
};

export type SuiBalanceConnection = {
  /** A list of edges. */
  edges: Array<SuiBalanceEdge>;
  /** A list of nodes. */
  nodes: Array<SuiBalance>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiBalanceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiBalance;
};

/** Input for withdrawing funds from an accumulator. */
export type SuiBalanceWithdraw = {
  /** How much to withdraw from the accumulator. */
  reservation?: Maybe<SuiWithdrawalReservation>;
  /** The type of the funds accumulator to withdraw from (e.g. `0x2::balance::Balance<0x2::sui::SUI>`). */
  type?: Maybe<SuiMoveType>;
  /** The account to withdraw funds from. */
  withdrawFrom?: Maybe<SuiWithdrawFrom>;
};

/** System transaction for initializing bridge committee. */
export type SuiBridgeCommitteeInitTransaction = {
  /** The initial shared version of the bridge object. */
  bridgeObjectVersion?: Maybe<Scalars["UInt53"]["output"]>;
};

/** System transaction for creating bridge state for cross-chain operations. */
export type SuiBridgeStateCreateTransaction = {
  /** The chain identifier for which this bridge state is being created. */
  chainIdentifier?: Maybe<Scalars["String"]["output"]>;
};

/**
 * A system transaction that updates epoch information on-chain (increments the current epoch). Executed by the system once per epoch, without using gas. Epoch change transactions cannot be submitted by users, because validators will refuse to sign them.
 *
 * This transaction kind is deprecated in favour of `EndOfEpochTransaction`.
 */
export type SuiChangeEpochTransaction = {
  /** The total amount of gas charged for computation during the epoch. */
  computationCharge?: Maybe<Scalars["UInt53"]["output"]>;
  /** The next (to become) epoch. */
  epoch?: Maybe<SuiEpoch>;
  /** Unix timestamp when epoch started. */
  epochStartTimestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /** The non-refundable storage fee. */
  nonRefundableStorageFee?: Maybe<Scalars["UInt53"]["output"]>;
  /** The epoch's corresponding protocol configuration. */
  protocolConfigs?: Maybe<SuiProtocolConfigs>;
  /** The total amount of gas charged for storage during the epoch. */
  storageCharge?: Maybe<Scalars["UInt53"]["output"]>;
  /** The amount of storage rebate refunded to the transaction senders. */
  storageRebate?: Maybe<Scalars["UInt53"]["output"]>;
  /** System packages that will be written by validators before the new epoch starts, to upgrade them on-chain. These objects do not have a "previous transaction" because they are not written on-chain yet. Consult `effects.objectChanges` for this transaction to see the actual objects written. */
  systemPackages?: Maybe<SuiMovePackageConnection>;
};

/**
 * A system transaction that updates epoch information on-chain (increments the current epoch). Executed by the system once per epoch, without using gas. Epoch change transactions cannot be submitted by users, because validators will refuse to sign them.
 *
 * This transaction kind is deprecated in favour of `EndOfEpochTransaction`.
 */
export type SuiChangeEpochTransactionSystemPackagesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Checkpoints contain finalized transactions and are used for node synchronization and global transaction ordering. */
export type SuiCheckpoint = SuiNode & {
  /**
   * A commitment by the committee at each checkpoint on the artifacts of the checkpoint.
   * e.g., object checkpoint states
   */
  artifactsDigest?: Maybe<Scalars["String"]["output"]>;
  /** The Base64 serialized BCS bytes of this checkpoint's contents. */
  contentBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** A 32-byte hash that uniquely identifies the checkpoint's content, encoded in Base58. */
  contentDigest?: Maybe<Scalars["String"]["output"]>;
  /** A 32-byte hash that uniquely identifies the checkpoint, encoded in Base58. This is a hash of the checkpoint's summary. */
  digest?: Maybe<Scalars["String"]["output"]>;
  /** The epoch that this checkpoint is part of. */
  epoch?: Maybe<SuiEpoch>;
  /** The checkpoint's globally unique identifier, which can be passed to `Query.node` to refetch it. */
  id: Scalars["ID"]["output"];
  /** The total number of transactions in the network by the end of this checkpoint. */
  networkTotalTransactions?: Maybe<Scalars["UInt53"]["output"]>;
  /** The digest of the previous checkpoint's summary. */
  previousCheckpointDigest?: Maybe<Scalars["String"]["output"]>;
  /** Query the RPC as if this checkpoint were the latest checkpoint. */
  query?: Maybe<SuiQuery>;
  /** The computation cost, storage cost, storage rebate, and non-refundable storage fee accumulated during this epoch, up to and including this checkpoint. These values increase monotonically across checkpoints in the same epoch, and reset on epoch boundaries. */
  rollingGasSummary?: Maybe<SuiGasCostSummary>;
  /** The checkpoint's position in the total order of finalized checkpoints, agreed upon by consensus. */
  sequenceNumber: Scalars["UInt53"]["output"];
  /** The Base64 serialized BCS bytes of this checkpoint's summary. */
  summaryBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** The timestamp at which the checkpoint is agreed to have happened according to consensus. Transactions that access time in this checkpoint will observe this timestamp. */
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
  transactions?: Maybe<SuiTransactionConnection>;
  /** The aggregation of signatures from a quorum of validators for the checkpoint proposal. */
  validatorSignatures?: Maybe<SuiValidatorAggregatedSignature>;
};

/** Checkpoints contain finalized transactions and are used for node synchronization and global transaction ordering. */
export type SuiCheckpointTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiCheckpointConnection = {
  /** A list of edges. */
  edges: Array<SuiCheckpointEdge>;
  /** A list of nodes. */
  nodes: Array<SuiCheckpoint>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiCheckpointEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiCheckpoint;
};

export type SuiCheckpointFilter = {
  /** Limit query results to checkpoints that occured strictly after the given checkpoint. */
  afterCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Limit query results to checkpoints that occured at the given checkpoint. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Limit query results to checkpoints at this epoch. */
  atEpoch?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Limit query results to checkpoints that occured strictly before the given checkpoint. */
  beforeCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A G1 elliptic curve point with 3 base10-encoded Bn254 field elements. */
export type SuiCircomG1 = {
  e0?: Maybe<Scalars["String"]["output"]>;
  e1?: Maybe<Scalars["String"]["output"]>;
  e2?: Maybe<Scalars["String"]["output"]>;
};

/** A G2 elliptic curve point with 6 base10-encoded Bn254 field elements. */
export type SuiCircomG2 = {
  e00?: Maybe<Scalars["String"]["output"]>;
  e01?: Maybe<Scalars["String"]["output"]>;
  e10?: Maybe<Scalars["String"]["output"]>;
  e11?: Maybe<Scalars["String"]["output"]>;
  e20?: Maybe<Scalars["String"]["output"]>;
  e21?: Maybe<Scalars["String"]["output"]>;
};

/** System transaction for creating the coin deny list state. */
export type SuiCoinDenyListStateCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadata = SuiIAddressable &
  SuiIMoveObject &
  SuiIObject & {
    /** The CoinMetadata's ID. */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /** Whether the `DenyCap` can be used to enable a global pause that behaves as if all addresses were added to the deny list. `null` indicates that it is not known whether the currency can be paused or not. This field is only populated on currencies held in the Coin Registry. To determine whether a legacy currency can be paused, check the contents of its `DenyCap`, if it can be found. */
    allowGlobalPause?: Maybe<Scalars["Boolean"]["output"]>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The structured representation of the object's contents. */
    contents?: Maybe<SuiMoveValue>;
    /** Number of decimal places the coin uses. */
    decimals?: Maybe<Scalars["Int"]["output"]>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /** If the currency is regulated, this object represents the capability to modify the deny list. If a capability is known but wrapped, its address can be fetched but other fields will not be accessible. */
    denyCap?: Maybe<SuiMoveObject>;
    /** Description of the coin. */
    description?: Maybe<Scalars["String"]["output"]>;
    /** 32-byte hash that identifies the object's contents, encoded in Base58. */
    digest?: Maybe<Scalars["String"]["output"]>;
    /**
     * Access a dynamic field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic field with that name could not be found attached to this object.
     */
    dynamicField?: Maybe<SuiDynamicField>;
    /**
     * Dynamic fields owned by this object.
     *
     * Dynamic fields on wrapped objects can be accessed using `Address.dynamicFields`.
     */
    dynamicFields?: Maybe<SuiDynamicFieldConnection>;
    /**
     * Access a dynamic object field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic object field with that name could not be found attached to this object.
     */
    dynamicObjectField?: Maybe<SuiDynamicField>;
    /**
     * Whether this object can be transfered using the `TransferObjects` Programmable Transaction Command or `sui::transfer::public_transfer`.
     *
     * Both these operations require the object to have both the `key` and `store` abilities.
     */
    hasPublicTransfer?: Maybe<Scalars["Boolean"]["output"]>;
    /** URL for the coin logo. */
    iconUrl?: Maybe<Scalars["String"]["output"]>;
    /** The Base64-encoded BCS serialize of this object, as a `MoveObject`. */
    moveObjectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Access dynamic fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Access dynamic object fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
    /** Name for the coin. */
    name?: Maybe<Scalars["String"]["output"]>;
    /** Fetch the object with the same ID, at a different version, root version bound, or checkpoint. */
    objectAt?: Maybe<SuiObject>;
    /** The Base64-encoded BCS serialization of this object, as an `Object`. */
    objectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this object after this one. */
    objectVersionsAfter?: Maybe<SuiObjectConnection>;
    /** Paginate all versions of this object before this one. */
    objectVersionsBefore?: Maybe<SuiObjectConnection>;
    /** Objects owned by this object, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /** The object's owner kind. */
    owner?: Maybe<SuiOwner>;
    /** The transaction that created this version of the object. */
    previousTransaction?: Maybe<SuiTransaction>;
    /** The transactions that sent objects to this object. */
    receivedTransactions?: Maybe<SuiTransactionConnection>;
    /** Whether the currency is regulated or not. `null` indicates that the regulatory status is unknown. */
    regulatedState?: Maybe<SuiRegulatedState>;
    /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
    storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
    /** The overall balance of coins issued. */
    supply?: Maybe<Scalars["BigInt"]["output"]>;
    /** Future behavior of the supply. `null` indicates that the future behavior of the supply is not known because the currency's treasury still exists. */
    supplyState?: Maybe<SuiSupplyState>;
    /** Symbol for the coin. */
    symbol?: Maybe<Scalars["String"]["output"]>;
    /** The version of this object that this content comes from. */
    version?: Maybe<Scalars["UInt53"]["output"]>;
  };

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** An object representing metadata about a coin type. */
export type SuiCoinMetadataReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** System transaction for creating the coin registry. */
export type SuiCoinRegistryCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** A single command in the programmable transaction. */
export type SuiCommand =
  | SuiMakeMoveVecCommand
  | SuiMergeCoinsCommand
  | SuiMoveCallCommand
  | SuiOtherCommand
  | SuiPublishCommand
  | SuiSplitCoinsCommand
  | SuiTransferObjectsCommand
  | SuiUpgradeCommand;

export type SuiCommandConnection = {
  /** A list of edges. */
  edges: Array<SuiCommandEdge>;
  /** A list of nodes. */
  nodes: Array<SuiCommand>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiCommandEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiCommand;
};

/**
 * A value produced or modified during command execution.
 *
 * This can represent either a return value from a command or an argument that was mutated by reference.
 */
export type SuiCommandOutput = {
  /** The transaction argument that this value corresponds to (if any). */
  argument?: Maybe<SuiTransactionArgument>;
  /** The structured Move value, if available. */
  value?: Maybe<SuiMoveValue>;
};

/** The intermediate results for each command of a transaction simulation. */
export type SuiCommandResult = {
  /** Changes made to arguments that were mutably borrowed by each command in this transaction. */
  mutatedReferences?: Maybe<Array<SuiCommandOutput>>;
  /** Return results of each command in this transaction. */
  returnValues?: Maybe<Array<SuiCommandOutput>>;
};

/** Object is exclusively owned by a single adderss and sequenced via consensus. */
export type SuiConsensusAddressOwner = {
  /** The owner's address. */
  address?: Maybe<SuiAddress>;
  /** The version at which the object most recently bcame a consensus object. This serves the same function as `Shared.initialSharedVersion`, except it may change if the object's `owner` type changes. */
  startVersion?: Maybe<Scalars["UInt53"]["output"]>;
};

/** System transaction that runs at the beginning of a checkpoint, and is responsible for setting the current value of the clock, based on the timestamp from consensus. */
export type SuiConsensusCommitPrologueTransaction = {
  /**
   * Digest of any additional state computed by the consensus handler.
   * Used to detect forking bugs as early as possible.
   *
   * Present in V4.
   */
  additionalStateDigest?: Maybe<Scalars["String"]["output"]>;
  /**
   * Unix timestamp from consensus.
   *
   * Present in V1, V2, V3, V4.
   */
  commitTimestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /**
   * Digest of consensus output, encoded as a Base58 string.
   *
   * Present in V2, V3, V4.
   */
  consensusCommitDigest?: Maybe<Scalars["String"]["output"]>;
  /**
   * Epoch of the commit prologue transaction.
   *
   * Present in V1, V2, V3, V4.
   */
  epoch?: Maybe<SuiEpoch>;
  /**
   * Consensus round of the commit.
   *
   * Present in V1, V2, V3, V4.
   */
  round?: Maybe<Scalars["UInt53"]["output"]>;
  /**
   * The sub DAG index of the consensus commit. This field is populated if there
   * are multiple consensus commits per round.
   *
   * Present in V3, V4.
   */
  subDagIndex?: Maybe<Scalars["UInt53"]["output"]>;
};

/** Reason why a transaction that attempted to access a consensus-managed object was cancelled. */
export enum SuiConsensusObjectCancellationReason {
  /** Read operation was cancelled. */
  CancelledRead = "CANCELLED_READ",
  /** Object congestion prevented execution. */
  Congested = "CONGESTED",
  /** Randomness service was unavailable. */
  RandomnessUnavailable = "RANDOMNESS_UNAVAILABLE",
  /** Internal use only. */
  Unknown = "UNKNOWN",
}

/** A transaction that was cancelled before it could access the consensus-managed object, so the object was an input but remained unchanged. */
export type SuiConsensusObjectCancelled = {
  /** The ID of the consensus-managed object that the transaction intended to access. */
  address?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** Reason why the transaction was cancelled. */
  cancellationReason?: Maybe<SuiConsensusObjectCancellationReason>;
};

export type SuiConsensusObjectRead = {
  /** The version of the consensus-managed object that was read by this transaction. */
  object?: Maybe<SuiObject>;
};

/** A rendered JSON blob based on an on-chain template. */
export type SuiDisplay = {
  /** If any fields failed to render, this will contain a mapping from failed field names to error messages. If all fields succeed, this will be `null`. */
  errors?: Maybe<Scalars["JSON"]["output"]>;
  /** Output for all successfully substituted display fields. Unsuccessful fields will be `null`, and will be accompanied by a field in `errors`, explaining the error. */
  output?: Maybe<Scalars["JSON"]["output"]>;
};

/** System transaction for creating the display registry. */
export type SuiDisplayRegistryCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicField = SuiIAddressable &
  SuiIMoveObject &
  SuiIObject &
  SuiNode & {
    /** The DynamicField's ID. */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The structured representation of the object's contents. */
    contents?: Maybe<SuiMoveValue>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /** 32-byte hash that identifies the object's contents, encoded in Base58. */
    digest?: Maybe<Scalars["String"]["output"]>;
    /**
     * Access a dynamic field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic field with that name could not be found attached to this object.
     */
    dynamicField?: Maybe<SuiDynamicField>;
    /**
     * Dynamic fields owned by this object.
     *
     * Dynamic fields on wrapped objects can be accessed using `Address.dynamicFields`.
     */
    dynamicFields?: Maybe<SuiDynamicFieldConnection>;
    /**
     * Access a dynamic object field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic object field with that name could not be found attached to this object.
     */
    dynamicObjectField?: Maybe<SuiDynamicField>;
    /**
     * Whether this object can be transfered using the `TransferObjects` Programmable Transaction Command or `sui::transfer::public_transfer`.
     *
     * Both these operations require the object to have both the `key` and `store` abilities.
     */
    hasPublicTransfer?: Maybe<Scalars["Boolean"]["output"]>;
    /** The dynamic field's globally unique identifier, which can be passed to `Query.node` to refetch it. */
    id: Scalars["ID"]["output"];
    /** The Base64-encoded BCS serialize of this object, as a `MoveObject`. */
    moveObjectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Access dynamic fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Access dynamic object fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
    /** The dynamic field's name, as a Move value. */
    name?: Maybe<SuiMoveValue>;
    /** Fetch the object with the same ID, at a different version, root version bound, or checkpoint. */
    objectAt?: Maybe<SuiObject>;
    /** The Base64-encoded BCS serialization of this object, as an `Object`. */
    objectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this object after this one. */
    objectVersionsAfter?: Maybe<SuiObjectConnection>;
    /** Paginate all versions of this object before this one. */
    objectVersionsBefore?: Maybe<SuiObjectConnection>;
    /** Objects owned by this object, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /** The object's owner kind. */
    owner?: Maybe<SuiOwner>;
    /** The transaction that created this version of the object. */
    previousTransaction?: Maybe<SuiTransaction>;
    /** The transactions that sent objects to this object. */
    receivedTransactions?: Maybe<SuiTransactionConnection>;
    /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
    storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
    /** The dynamic field's value, as a Move value for dynamic fields and as a MoveObject for dynamic object fields. */
    value?: Maybe<SuiDynamicFieldValue>;
    /** The version of this object that this content comes from. */
    version?: Maybe<Scalars["UInt53"]["output"]>;
  };

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Dynamic fields are heterogenous fields that can be added or removed from an object at runtime. Their names are arbitrary Move values that have `copy`, `drop`, and `store`.
 *
 * There are two sub-types of dynamic fields:
 *
 * - Dynamic fields can store any value that has `store`. Objects stored in this kind of field will be considered wrapped (not accessible via its ID by external tools like explorers, wallets, etc. accessing storage).
 * - Dynamic object fields can only store objects (values that have the `key` ability, and an `id: UID` as its first field) that have `store`, but they will still be directly accessible off-chain via their ID after being attached as a field.
 */
export type SuiDynamicFieldReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiDynamicFieldConnection = {
  /** A list of edges. */
  edges: Array<SuiDynamicFieldEdge>;
  /** A list of nodes. */
  nodes: Array<SuiDynamicField>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiDynamicFieldEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiDynamicField;
};

/**
 * A description of a dynamic field's name.
 *
 * Names can either be given as serialized `bcs` accompanied by its `type`, or as a Display v2 `literal` expression. Other combinations of inputs are not supported.
 */
export type SuiDynamicFieldName = {
  /** The Base64-encoded BCS serialization of the dynamic field's 'name'. */
  bcs?: InputMaybe<Scalars["Base64"]["input"]>;
  /** The name represented as a Display v2 literal expression. */
  literal?: InputMaybe<Scalars["String"]["input"]>;
  /** The type of the dynamic field's name, like 'u64' or '0x2::kiosk::Listing'. */
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/** The value of a dynamic field (`MoveValue`) or dynamic object field (`MoveObject`). */
export type SuiDynamicFieldValue = SuiMoveObject | SuiMoveValue;

/** An Ed25519 public key. */
export type SuiEd25519PublicKey = {
  /** The raw public key bytes. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
};

/** An Ed25519 signature. */
export type SuiEd25519Signature = {
  /** The public key bytes. */
  publicKey?: Maybe<Scalars["Base64"]["output"]>;
  /** The raw signature bytes. */
  signature?: Maybe<Scalars["Base64"]["output"]>;
};

/** System transaction that supersedes `ChangeEpochTransaction` as the new way to run transactions at the end of an epoch. Behaves similarly to `ChangeEpochTransaction` but can accommodate other optional transactions to run at the end of the epoch. */
export type SuiEndOfEpochTransaction = {
  /** The list of system transactions that are allowed to run at the end of the epoch. */
  transactions?: Maybe<SuiEndOfEpochTransactionKindConnection>;
};

/** System transaction that supersedes `ChangeEpochTransaction` as the new way to run transactions at the end of an epoch. Behaves similarly to `ChangeEpochTransaction` but can accommodate other optional transactions to run at the end of the epoch. */
export type SuiEndOfEpochTransactionTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiEndOfEpochTransactionKind =
  | SuiAccumulatorRootCreateTransaction
  | SuiAddressAliasStateCreateTransaction
  | SuiAuthenticatorStateCreateTransaction
  | SuiAuthenticatorStateExpireTransaction
  | SuiBridgeCommitteeInitTransaction
  | SuiBridgeStateCreateTransaction
  | SuiChangeEpochTransaction
  | SuiCoinDenyListStateCreateTransaction
  | SuiCoinRegistryCreateTransaction
  | SuiDisplayRegistryCreateTransaction
  | SuiRandomnessStateCreateTransaction
  | SuiStoreExecutionTimeObservationsTransaction
  | SuiWriteAccumulatorStorageCostTransaction;

export type SuiEndOfEpochTransactionKindConnection = {
  /** A list of edges. */
  edges: Array<SuiEndOfEpochTransactionKindEdge>;
  /** A list of nodes. */
  nodes: Array<SuiEndOfEpochTransactionKind>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiEndOfEpochTransactionKindEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiEndOfEpochTransactionKind;
};

/**
 * Activity on Sui is partitioned in time, into epochs.
 *
 * Epoch changes are opportunities for the network to reconfigure itself (perform protocol or system package upgrades, or change the committee) and distribute staking rewards. The network aims to keep epochs roughly the same duration as each other.
 *
 * During a particular epoch the following data is fixed:
 *
 * - protocol version,
 * - reference gas price,
 * - system package versions,
 * - validators in the committee.
 */
export type SuiEpoch = SuiNode & {
  /** The epoch's corresponding checkpoints. */
  checkpoints?: Maybe<SuiCheckpointConnection>;
  /**
   * State of the Coin DenyList object (0x403) at the start of this epoch.
   *
   * The DenyList controls access to Regulated Coins. Writes to the DenyList are accumulated and only take effect on the next epoch boundary. Consequently, it's possible to determine the state of the DenyList for a transaction by reading it at the start of the epoch the transaction is in.
   */
  coinDenyList?: Maybe<SuiObject>;
  /** The timestamp associated with the last checkpoint in the epoch (or `null` if the epoch has not finished yet). */
  endTimestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /** The epoch's id as a sequence number that starts at 0 and is incremented by one at every epoch change. */
  epochId: Scalars["UInt53"]["output"];
  /** The storage fees paid for transactions executed during the epoch (or `null` if the epoch has not finished yet). */
  fundInflow?: Maybe<Scalars["BigInt"]["output"]>;
  /** The storage fee rebates paid to users who deleted the data associated with past transactions (or `null` if the epoch has not finished yet). */
  fundOutflow?: Maybe<Scalars["BigInt"]["output"]>;
  /**
   * The storage fund available in this epoch (or `null` if the epoch has not finished yet).
   * This fund is used to redistribute storage fees from past transactions to future validators.
   */
  fundSize?: Maybe<Scalars["BigInt"]["output"]>;
  /** The epoch's globally unique identifier, which can be passed to `Query.node` to refetch it. */
  id: Scalars["ID"]["output"];
  /**
   * A commitment by the committee at the end of epoch on the contents of the live object set at that time.
   * This can be used to verify state snapshots.
   */
  liveObjectSetDigest?: Maybe<Scalars["String"]["output"]>;
  /** The difference between the fund inflow and outflow, representing the net amount of storage fees accumulated in this epoch (or `null` if the epoch has not finished yet). */
  netInflow?: Maybe<Scalars["BigInt"]["output"]>;
  /** The epoch's corresponding protocol configuration, including the feature flags and the configuration options. */
  protocolConfigs?: Maybe<SuiProtocolConfigs>;
  /** The minimum gas price that a quorum of validators are guaranteed to sign a transaction for in this epoch. */
  referenceGasPrice?: Maybe<Scalars["BigInt"]["output"]>;
  /** The timestamp associated with the first checkpoint in the epoch. */
  startTimestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /** The system packages used by all transactions in this epoch. */
  systemPackages?: Maybe<SuiMovePackageConnection>;
  /** The contents of the system state inner object at the start of this epoch. */
  systemState?: Maybe<SuiMoveValue>;
  /**
   * The total number of checkpoints in this epoch.
   *
   * Returns `None` when no checkpoint is set in scope (e.g. execution scope).
   */
  totalCheckpoints?: Maybe<Scalars["UInt53"]["output"]>;
  /** The total amount of gas fees (in MIST) that were paid in this epoch (or `null` if the epoch has not finished yet). */
  totalGasFees?: Maybe<Scalars["BigInt"]["output"]>;
  /** The total MIST rewarded as stake (or `null` if the epoch has not finished yet). */
  totalStakeRewards?: Maybe<Scalars["BigInt"]["output"]>;
  /** The amount added to total gas fees to make up the total stake rewards (or `null` if the epoch has not finished yet). */
  totalStakeSubsidies?: Maybe<Scalars["BigInt"]["output"]>;
  /**
   * The total number of transaction blocks in this epoch.
   *
   * If the epoch has not finished yet, this number is computed based on the number of transactions at the latest known checkpoint.
   */
  totalTransactions?: Maybe<Scalars["UInt53"]["output"]>;
  /**
   * The transactions in this epoch, optionally filtered by transaction filters.
   *
   * Returns `None` when no checkpoint is set in scope (e.g. execution scope).
   */
  transactions?: Maybe<SuiTransactionConnection>;
  /** Validator-related properties, including the active validators. */
  validatorSet?: Maybe<SuiValidatorSet>;
};

/**
 * Activity on Sui is partitioned in time, into epochs.
 *
 * Epoch changes are opportunities for the network to reconfigure itself (perform protocol or system package upgrades, or change the committee) and distribute staking rewards. The network aims to keep epochs roughly the same duration as each other.
 *
 * During a particular epoch the following data is fixed:
 *
 * - protocol version,
 * - reference gas price,
 * - system package versions,
 * - validators in the committee.
 */
export type SuiEpochCheckpointsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiCheckpointFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Activity on Sui is partitioned in time, into epochs.
 *
 * Epoch changes are opportunities for the network to reconfigure itself (perform protocol or system package upgrades, or change the committee) and distribute staking rewards. The network aims to keep epochs roughly the same duration as each other.
 *
 * During a particular epoch the following data is fixed:
 *
 * - protocol version,
 * - reference gas price,
 * - system package versions,
 * - validators in the committee.
 */
export type SuiEpochSystemPackagesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Activity on Sui is partitioned in time, into epochs.
 *
 * Epoch changes are opportunities for the network to reconfigure itself (perform protocol or system package upgrades, or change the committee) and distribute staking rewards. The network aims to keep epochs roughly the same duration as each other.
 *
 * During a particular epoch the following data is fixed:
 *
 * - protocol version,
 * - reference gas price,
 * - system package versions,
 * - validators in the committee.
 */
export type SuiEpochTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiEpochConnection = {
  /** A list of edges. */
  edges: Array<SuiEpochEdge>;
  /** A list of nodes. */
  nodes: Array<SuiEpoch>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiEpochEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiEpoch;
};

export type SuiEvent = {
  /** The Move value emitted for this event. */
  contents?: Maybe<SuiMoveValue>;
  /**
   * The Base64 encoded BCS serialized bytes of the entire Event structure from sui-types.
   * This includes: package_id, transaction_module, sender, type, and contents (which itself contains the BCS-serialized Move struct data).
   */
  eventBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** Address of the sender of the transaction that emitted this event. */
  sender?: Maybe<SuiAddress>;
  /** The position of the event among the events from the same transaction. */
  sequenceNumber: Scalars["UInt53"]["output"];
  /**
   * Timestamp corresponding to the checkpoint this event's transaction was finalized in.
   * All events from the same transaction share the same timestamp.
   *
   * `null` for simulated/executed transactions as they are not included in a checkpoint.
   */
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /** The transaction that emitted this event. This information is only available for events from indexed transactions, and not from transactions that have just been executed or dry-run. */
  transaction?: Maybe<SuiTransaction>;
  /** The module containing the function that was called in the programmable transaction, that resulted in this event being emitted. */
  transactionModule?: Maybe<SuiMoveModule>;
};

export type SuiEventConnection = {
  /** A list of edges. */
  edges: Array<SuiEventEdge>;
  /** A list of nodes. */
  nodes: Array<SuiEvent>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiEventEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiEvent;
};

export type SuiEventFilter = {
  /** Limit to events that occured strictly after the given checkpoint. */
  afterCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Limit to events in the given checkpoint. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Limit to event that occured strictly before the given checkpoint. */
  beforeCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /**
   * Events emitted by a particular module. An event is emitted by a particular module if some function in the module is called by a PTB and emits an event.
   *
   * Modules can be filtered by their package, or package::module. We currently do not support filtering by emitting module and event type at the same time so if both are provided in one filter, the query will error.
   */
  module?: InputMaybe<Scalars["String"]["input"]>;
  /** Filter on events by transaction sender address. */
  sender?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  /**
   * This field is used to specify the type of event emitted.
   *
   * Events can be filtered by their type's package, package::module, or their fully qualified type name.
   *
   * Generic types can be queried by either the generic type name, e.g. `0x2::coin::Coin`, or by the full type name, such as `0x2::coin::Coin<0x2::sui::SUI>`.
   */
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/** Represents execution error information for failed transactions. */
export type SuiExecutionError = {
  /**
   * The error code of the Move abort, populated if this transaction failed with a Move abort.
   *
   * Returns the explicit code if the abort used `code` annotation (e.g., `abort(ERR, code = 5)` returns 5), otherwise returns the raw abort code containing encoded error information.
   */
  abortCode?: Maybe<Scalars["BigInt"]["output"]>;
  /**
   * An associated constant for the error. Only populated for clever errors.
   *
   * Constants are returned as human-readable strings when possible. Complex types are returned as Base64-encoded bytes.
   */
  constant?: Maybe<Scalars["String"]["output"]>;
  /** The function that the abort originated from. Only populated for Move aborts and primitive runtime errors that have function name information. */
  function?: Maybe<SuiMoveFunction>;
  /** The error's name. Only populated for clever errors. */
  identifier?: Maybe<Scalars["String"]["output"]>;
  /** The instruction offset in the Move bytecode where the error occurred. Populated for Move aborts and primitive runtime errors. */
  instructionOffset?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Human readable explanation of why the transaction failed.
   *
   * For Move aborts, the error message will be resolved to a human-readable form if possible, otherwise it will fall back to displaying the abort code and location.
   */
  message: Scalars["String"]["output"];
  /** The module that the abort originated from. Only populated for Move aborts and primitive runtime errors. */
  module?: Maybe<SuiMoveModule>;
  /** The source line number for the abort. Only populated for clever errors. */
  sourceLineNumber?: Maybe<Scalars["Int"]["output"]>;
};

/** The execution result of a transaction, including the transaction effects. */
export type SuiExecutionResult = {
  /** The effects of the transaction execution. */
  effects?: Maybe<SuiTransactionEffects>;
};

/** The execution status of this transaction: success or failure. */
export enum SuiExecutionStatus {
  /** The transaction could not be executed. */
  Failure = "FAILURE",
  /** The transaction was successfully executed. */
  Success = "SUCCESS",
}

/** A boolean protocol configuration. */
export type SuiFeatureFlag = {
  /** Feature flag name. */
  key: Scalars["String"]["output"];
  /** Feature flag value. */
  value: Scalars["Boolean"]["output"];
};

/** Access to the gas inputs, after they have been smashed into one coin. The gas coin can only be used by reference, except for with `TransferObjectsTransaction` that can accept it by value. */
export type SuiGasCoin = {
  /** Placeholder field (gas coin has no additional data) */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/**
 * Summary of charges from transactions.
 *
 * Storage is charged in three parts -- `storage_cost`, `-storage_rebate`, and `non_refundable_storage_fee` -- independently of `computation_cost`.
 *
 * The overall cost of a transaction, deducted from its gas coins, is its `computation_cost + storage_cost - storage_rebate`. `non_refundable_storage_fee` is collected from objects being mutated or deleted and accumulated by the system in storage funds, the remaining storage costs of previous object versions are what become the `storage_rebate`. The ratio between `non_refundable_storage_fee` and `storage_rebate` is set by the protocol.
 */
export type SuiGasCostSummary = {
  /** The sum cost of computation/execution */
  computationCost?: Maybe<Scalars["UInt53"]["output"]>;
  /** Amount that is retained by the system in the storage fund from the cost of the previous versions of objects being mutated or deleted. */
  nonRefundableStorageFee?: Maybe<Scalars["UInt53"]["output"]>;
  /** Cost for storage at the time the transaction is executed, calculated as the size of the objects being mutated in bytes multiplied by a storage cost per byte (part of the protocol). */
  storageCost?: Maybe<Scalars["UInt53"]["output"]>;
  /** Amount the user gets back from the storage cost of the previous versions of objects being mutated or deleted. */
  storageRebate?: Maybe<Scalars["UInt53"]["output"]>;
};

/** Effects related to gas (costs incurred and the identity of the smashed gas object returned). */
export type SuiGasEffects = {
  /** The gas object used to pay for this transaction. If multiple gas coins were provided, this represents the combined coin after smashing. */
  gasObject?: Maybe<SuiObject>;
  /** Breakdown of the gas costs for this transaction. */
  gasSummary?: Maybe<SuiGasCostSummary>;
};

export type SuiGasInput = {
  /** The maximum SUI that can be expended by executing this transaction */
  gasBudget?: Maybe<Scalars["BigInt"]["output"]>;
  /** Objects used to pay for a transaction's execution and storage */
  gasPayment?: Maybe<SuiObjectConnection>;
  /** An unsigned integer specifying the number of native tokens per gas unit this transaction will pay (in MIST). */
  gasPrice?: Maybe<Scalars["BigInt"]["output"]>;
  /** Address of the owner of the gas object(s) used. */
  gasSponsor?: Maybe<SuiAddress>;
};

export type SuiGasInputGasPaymentArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** System transaction that initializes the network and writes the initial set of objects on-chain. */
export type SuiGenesisTransaction = {
  /** Objects to be created during genesis. */
  objects?: Maybe<SuiObjectConnection>;
};

/** System transaction that initializes the network and writes the initial set of objects on-chain. */
export type SuiGenesisTransactionObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressable = {
  address: Scalars["SuiAddress"]["output"];
  /**
   * Fetch the address as it was at a different root version, or checkpoint.
   *
   * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
   */
  addressAt?: Maybe<SuiAddress>;
  /**
   * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
   *
   * If the address does not own any coins of that type, a balance of zero is returned.
   */
  balance?: Maybe<SuiBalance>;
  /** Total balance across coins owned by this address, grouped by coin type. */
  balances?: Maybe<SuiBalanceConnection>;
  /** The domain explicitly configured as the default Name Service name for this address. */
  defaultNameRecord?: Maybe<SuiNameRecord>;
  /**
   * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
   *
   * Returns `null` when no checkpoint is set in scope (e.g. execution scope). If the address does not own any coins of a given type, a balance of zero is returned for that type.
   */
  multiGetBalances?: Maybe<Array<SuiBalance>>;
  /** Objects owned by this address, optionally filtered by type. */
  objects?: Maybe<SuiMoveObjectConnection>;
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressableAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressableBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressableBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressableMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/**
 * Interface implemented by GraphQL types representing entities that are identified by an address.
 *
 * An address uniquely represents either the public key of an account, or an object's ID, but never both. It is not possible to determine which type an address represents up-front. If an object is wrapped, its contents will not be accessible via its address, but it will still be possible to access other objects it owns.
 */
export type SuiIAddressableObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Interface implemented by all GraphQL types that represent a Move datatype definition (either a struct or an enum definition).
 *
 * This interface is used to provide a way to access fields that are shared by both structs and enums, e.g., the module that the datatype belongs to, the name of the datatype, type parameters etc.
 */
export type SuiIMoveDatatype = {
  /** Abilities on this datatype definition. */
  abilities?: Maybe<Array<SuiMoveAbility>>;
  /** The datatype's fully-qualified name, including package address, module name, and datatype name. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** The module that this datatype is defined in */
  module: SuiMoveModule;
  /** The datatype's unqualified name */
  name: Scalars["String"]["output"];
  /**
   * Constraints on the datatype's formal type parameters
   *
   * Move bytecode does not name type parameters, so when they are referenced (e.g. in field types), they are identified by their index in this list.
   */
  typeParameters?: Maybe<Array<SuiMoveDatatypeTypeParameter>>;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObject = {
  /** The structured representation of the object's contents. */
  contents?: Maybe<SuiMoveValue>;
  /**
   * Access a dynamic field on an object using its type and BCS-encoded name.
   *
   * Returns `null` if a dynamic field with that name could not be found attached to this object.
   */
  dynamicField?: Maybe<SuiDynamicField>;
  /**
   * Dynamic fields and dynamic object fields owned by this object.
   *
   * Dynamic fields on wrapped objects can be accessed using `Address.dynamicFields`.
   */
  dynamicFields?: Maybe<SuiDynamicFieldConnection>;
  /**
   * Access a dynamic object field on an object using its type and BCS-encoded name.
   *
   * Returns `null` if a dynamic object field with that name could not be found attached to this object.
   */
  dynamicObjectField?: Maybe<SuiDynamicField>;
  /**
   * Whether this object can be transfered using the `TransferObjects` Programmable Transaction Command or `sui::transfer::public_transfer`.
   *
   * Both these operations require the object to have both the `key` and `store` abilities.
   */
  hasPublicTransfer?: Maybe<Scalars["Boolean"]["output"]>;
  /** The Base64-encoded BCS serialize of this object, as a `MoveObject`. */
  moveObjectBcs?: Maybe<Scalars["Base64"]["output"]>;
  /**
   * Access dynamic fields on an object using their types and BCS-encoded names.
   *
   * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
   */
  multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
  /**
   * Access dynamic object fields on an object using their types and BCS-encoded names.
   *
   * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
   */
  multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObjectDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObjectDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObjectDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObjectMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** Interface implemented by types that represent a Move object on-chain (A Move value whose type has `key`). */
export type SuiIMoveObjectMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** Interface implemented by versioned on-chain values that are addressable by an ID (also referred to as its address). This includes Move objects and packages. */
export type SuiIObject = {
  /** 32-byte hash that identifies the object's contents, encoded in Base58. */
  digest?: Maybe<Scalars["String"]["output"]>;
  /** Fetch the object with the same ID, at a different version, root version bound, or checkpoint. */
  objectAt?: Maybe<SuiObject>;
  /** The Base64-encoded BCS serialization of this object, as an `Object`. */
  objectBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** Paginate all versions of this object after this one. */
  objectVersionsAfter?: Maybe<SuiObjectConnection>;
  /** Paginate all versions of this object before this one. */
  objectVersionsBefore?: Maybe<SuiObjectConnection>;
  /** The object's owner kind. */
  owner?: Maybe<SuiOwner>;
  /** The transaction that created this version of the object */
  previousTransaction?: Maybe<SuiTransaction>;
  /** The transactions that sent objects to this object. */
  receivedTransactions?: Maybe<SuiTransactionConnection>;
  /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
  storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
  /** The version of this object that this content comes from. */
  version?: Maybe<Scalars["UInt53"]["output"]>;
};

/** Interface implemented by versioned on-chain values that are addressable by an ID (also referred to as its address). This includes Move objects and packages. */
export type SuiIObjectObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** Interface implemented by versioned on-chain values that are addressable by an ID (also referred to as its address). This includes Move objects and packages. */
export type SuiIObjectObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Interface implemented by versioned on-chain values that are addressable by an ID (also referred to as its address). This includes Move objects and packages. */
export type SuiIObjectObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Interface implemented by versioned on-chain values that are addressable by an ID (also referred to as its address). This includes Move objects and packages. */
export type SuiIObjectReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Object is accessible to all addresses, and is immutable. */
export type SuiImmutable = {
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

export type SuiInput = {
  /** The index of the input. */
  ix?: Maybe<Scalars["Int"]["output"]>;
};

/** Information used by a package to link to a specific version of its dependency. */
export type SuiLinkage = {
  /** The ID on-chain of the first version of the dependency. */
  originalId?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** The ID on-chain of the version of the dependency that this package depends on. */
  upgradedId?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** The version of the dependency that this package depends on. */
  version?: Maybe<Scalars["UInt53"]["output"]>;
};

/** Create a vector (can be empty). */
export type SuiMakeMoveVecCommand = {
  /** The values to pack into the vector, all of the same type. */
  elements?: Maybe<Array<SuiTransactionArgument>>;
  /** If the elements are not objects, or the vector is empty, a type must be supplied. */
  type?: Maybe<SuiMoveType>;
};

/** Merges `coins` into the first `coin` (produces no results). */
export type SuiMergeCoinsCommand = {
  /** The coin to merge into. */
  coin?: Maybe<SuiTransactionArgument>;
  /** The coins to be merged. */
  coins: Array<SuiTransactionArgument>;
};

/** Abilities are keywords in Sui Move that define how types behave at the compiler level. */
export enum SuiMoveAbility {
  /** Enables values to be copied. */
  Copy = "COPY",
  /** Enables values to be popped/dropped. */
  Drop = "DROP",
  /** Enables values to be held directly in global storage. */
  Key = "KEY",
  /** Enables values to be held inside a struct in global storage. */
  Store = "STORE",
}

export type SuiMoveCallCommand = {
  /** The actual function parameters passed in for this move call. */
  arguments: Array<SuiTransactionArgument>;
  /** The function being called. */
  function: SuiMoveFunction;
};

/** Description of a datatype, defined in a Move module. */
export type SuiMoveDatatype = SuiIMoveDatatype & {
  /** Abilities on this datatype definition. */
  abilities?: Maybe<Array<SuiMoveAbility>>;
  /** Attempts to convert the `MoveDatatype` to a `MoveEnum`. */
  asMoveEnum?: Maybe<SuiMoveEnum>;
  /** Attempts to convert the `MoveDatatype` to a `MoveStruct`. */
  asMoveStruct?: Maybe<SuiMoveStruct>;
  /** The datatype's fully-qualified name, including package address, module name, and datatype name. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** The module that this datatype is defined in. */
  module: SuiMoveModule;
  /** The datatype's unqualified name. */
  name: Scalars["String"]["output"];
  /**
   * Constraints on the datatype's formal type parameters.
   *
   * Move bytecode does not name type parameters, so when they are referenced (e.g. in field types), they are identified by their index in this list.
   */
  typeParameters?: Maybe<Array<SuiMoveDatatypeTypeParameter>>;
};

export type SuiMoveDatatypeConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveDatatypeEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveDatatype>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveDatatypeEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveDatatype;
};

/** Declaration of a type parameter on a Move struct. */
export type SuiMoveDatatypeTypeParameter = {
  /** Ability constraints on this type parameter. */
  constraints: Array<SuiMoveAbility>;
  /**
   * Whether this type parameter is marked `phantom` or not.
   *
   * Phantom type parameters are not referenced in the struct's fields.
   */
  isPhantom: Scalars["Boolean"]["output"];
};

/** Description of an enum type, defined in a Move module. */
export type SuiMoveEnum = SuiIMoveDatatype & {
  /** Abilities on this enum definition. */
  abilities?: Maybe<Array<SuiMoveAbility>>;
  /** The enum's fully-qualified name, including package address, module name, and datatype name. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** The module that this enum is defined in. */
  module: SuiMoveModule;
  /** The enum's unqualified name. */
  name: Scalars["String"]["output"];
  /**
   * Constraints on the enum's formal type parameters.
   *
   * Move bytecode does not name type parameters, so when they are referenced (e.g. in field types), they are identified by their index in this list.
   */
  typeParameters?: Maybe<Array<SuiMoveDatatypeTypeParameter>>;
  /**
   * The names and fields of the enum's variants
   *
   * Field types reference type parameters by their index in the defining enum's `typeParameters` list.
   */
  variants?: Maybe<Array<SuiMoveEnumVariant>>;
};

export type SuiMoveEnumConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveEnumEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveEnum>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveEnumEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveEnum;
};

export type SuiMoveEnumVariant = {
  /**
   * The names and types of the variant's fields.
   *
   * Field types reference type parameters by their index in the defining struct's `typeParameters` list.
   */
  fields?: Maybe<Array<SuiMoveField>>;
  /** The variant's name. */
  name?: Maybe<Scalars["String"]["output"]>;
};

export type SuiMoveField = {
  /** The field's name. */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * The field's type.
   *
   * This type can reference type parameters introduced by the defining struct (see `typeParameters`).
   */
  type?: Maybe<SuiOpenMoveType>;
};

/** A function defined in a Move module. */
export type SuiMoveFunction = {
  /** The function's fully-qualified name, including package address, module name, and function name. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** Whether the function is marked `entry` or not. */
  isEntry?: Maybe<Scalars["Boolean"]["output"]>;
  /** The module that this function is defined in. */
  module: SuiMoveModule;
  /** The function's unqualified name. */
  name: Scalars["String"]["output"];
  /** The function's parameter types. These types can reference type parameters introduced by this function (see `typeParameters`). */
  parameters?: Maybe<Array<SuiOpenMoveType>>;
  /** The function's return types. There can be multiple because functions in Move can return multiple values. These types can reference type parameters introduced by this function (see `typeParameters`). */
  return?: Maybe<Array<SuiOpenMoveType>>;
  /**
   * Constraints on the function's formal type parameters.
   *
   * Move bytecode does not name type parameters, so when they are referenced (e.g. in parameter and return types), they are identified by their index in this list.
   */
  typeParameters?: Maybe<Array<SuiMoveFunctionTypeParameter>>;
  /** The function's visibility: `public`, `public(friend)`, or `private`. */
  visibility?: Maybe<SuiMoveVisibility>;
};

export type SuiMoveFunctionConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveFunctionEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveFunction>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveFunctionEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveFunction;
};

/** Declaration of a type parameter on a Move function. */
export type SuiMoveFunctionTypeParameter = {
  /** Ability constraints on this type parameter. */
  constraints: Array<SuiMoveAbility>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModule = {
  /** Base64 encoded bytes of the serialized CompiledModule. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
  /** The datatype (struct or enum) named `name` in this module. */
  datatype?: Maybe<SuiMoveDatatype>;
  /** Paginate through this module's datatype definitions. */
  datatypes?: Maybe<SuiMoveDatatypeConnection>;
  /** Textual representation of the module's bytecode. */
  disassembly?: Maybe<Scalars["String"]["output"]>;
  /** The enum named `name` in this module. */
  enum?: Maybe<SuiMoveEnum>;
  /** Paginate through this module's enum definitions. */
  enums?: Maybe<SuiMoveEnumConnection>;
  /** Bytecode format version. */
  fileFormatVersion?: Maybe<Scalars["Int"]["output"]>;
  /** Modules that this module considers friends. These modules can call `public(package)` functions in this module. */
  friends?: Maybe<SuiMoveModuleConnection>;
  /** The module's fully-qualified name, including its package address. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** The function named `name` in this module. */
  function?: Maybe<SuiMoveFunction>;
  /** Paginate through this module's function definitions. */
  functions?: Maybe<SuiMoveFunctionConnection>;
  /** The module's unqualified name. */
  name: Scalars["String"]["output"];
  /** The package that this module was defined in. */
  package?: Maybe<SuiMovePackage>;
  /** The struct named `name` in this module. */
  struct?: Maybe<SuiMoveStruct>;
  /** Paginate through this module's struct definitions. */
  structs?: Maybe<SuiMoveStructConnection>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleDatatypeArgs = {
  name: Scalars["String"]["input"];
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleDatatypesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleEnumArgs = {
  name: Scalars["String"]["input"];
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleEnumsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleFriendsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleFunctionArgs = {
  name: Scalars["String"]["input"];
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleFunctionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleStructArgs = {
  name: Scalars["String"]["input"];
};

/**
 * Modules are a unit of code organization in Move.
 *
 * Modules belong to packages, and contain type and function definitions.
 */
export type SuiMoveModuleStructsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiMoveModuleConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveModuleEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveModule>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveModuleEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveModule;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObject = SuiIAddressable &
  SuiIMoveObject &
  SuiIObject &
  SuiNode & {
    /** The MoveObject's ID. */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /** Attempts to convert the object into a CoinMetadata. */
    asCoinMetadata?: Maybe<SuiCoinMetadata>;
    /** Attempts to convert the object into a DynamicField. */
    asDynamicField?: Maybe<SuiDynamicField>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The structured representation of the object's contents. */
    contents?: Maybe<SuiMoveValue>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /** 32-byte hash that identifies the object's contents, encoded in Base58. */
    digest?: Maybe<Scalars["String"]["output"]>;
    /**
     * Access a dynamic field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic field with that name could not be found attached to this object.
     */
    dynamicField?: Maybe<SuiDynamicField>;
    /**
     * Dynamic fields owned by this object.
     *
     * Dynamic fields on wrapped objects can be accessed using `Address.dynamicFields`.
     */
    dynamicFields?: Maybe<SuiDynamicFieldConnection>;
    /**
     * Access a dynamic object field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic object field with that name could not be found attached to this object.
     */
    dynamicObjectField?: Maybe<SuiDynamicField>;
    /**
     * Whether this object can be transfered using the `TransferObjects` Programmable Transaction Command or `sui::transfer::public_transfer`.
     *
     * Both these operations require the object to have both the `key` and `store` abilities.
     */
    hasPublicTransfer?: Maybe<Scalars["Boolean"]["output"]>;
    /** The Move object's globally unique identifier, which can be passed to `Query.node` to refetch it. */
    id: Scalars["ID"]["output"];
    /** The Base64-encoded BCS serialize of this object, as a `MoveObject`. */
    moveObjectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Access dynamic fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Access dynamic object fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Fetch the object with the same ID, at a different version, root version bound, or checkpoint.
     *
     * If no additional bound is provided, the latest version of this object is fetched at the latest checkpoint.
     */
    objectAt?: Maybe<SuiObject>;
    /** The Base64-encoded BCS serialization of this object, as an `Object`. */
    objectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this object after this one. */
    objectVersionsAfter?: Maybe<SuiObjectConnection>;
    /** Paginate all versions of this object before this one. */
    objectVersionsBefore?: Maybe<SuiObjectConnection>;
    /** Objects owned by this object, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /** The object's owner kind. */
    owner?: Maybe<SuiOwner>;
    /** The transaction that created this version of the object. */
    previousTransaction?: Maybe<SuiTransaction>;
    /** The transactions that sent objects to this object. */
    receivedTransactions?: Maybe<SuiTransactionConnection>;
    /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
    storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
    /** The version of this object that this content comes from. */
    version?: Maybe<Scalars["UInt53"]["output"]>;
  };

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MoveObject is a kind of Object that reprsents data stored on-chain. */
export type SuiMoveObjectReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiMoveObjectConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveObjectEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveObject>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveObjectEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveObject;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackage = SuiIAddressable &
  SuiIObject &
  SuiNode & {
    /** The MovePackage's ID. */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /** 32-byte hash that identifies the package's contents, encoded in Base58. */
    digest?: Maybe<Scalars["String"]["output"]>;
    /** The package's globally unique identifier, which can be passed to `Query.node` to refetch it. */
    id: Scalars["ID"]["output"];
    /** The transitive dependencies of this package. */
    linkage?: Maybe<Array<SuiLinkage>>;
    /** The module named `name` in this package. */
    module?: Maybe<SuiMoveModule>;
    /** BCS representation of the package's modules.  Modules appear as a sequence of pairs (module name, followed by module bytes), in alphabetic order by module name. */
    moduleBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate through this package's modules. */
    modules?: Maybe<SuiMoveModuleConnection>;
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Fetch the package as an object with the same ID, at a different version, root version bound, or checkpoint.
     *
     * If no additional bound is provided, the latest version of this object is fetched at the latest checkpoint.
     */
    objectAt?: Maybe<SuiObject>;
    /** The Base64-encoded BCS serialization of this package, as an `Object`. */
    objectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this package treated as an object, after this one. */
    objectVersionsAfter?: Maybe<SuiObjectConnection>;
    /** Paginate all versions of this package treated as an object, before this one. */
    objectVersionsBefore?: Maybe<SuiObjectConnection>;
    /** Objects owned by this package, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /** The object's owner kind. */
    owner?: Maybe<SuiOwner>;
    /**
     * Fetch the package with the same original ID, at a different version, or checkpoint.
     *
     * If no additional bound is provided, the package is fetched at the latest checkpoint known to the RPC.
     */
    packageAt?: Maybe<SuiMovePackage>;
    /** The Base64-encoded BCS serialization of this package, as a `MovePackage`. */
    packageBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this package after this one. */
    packageVersionsAfter?: Maybe<SuiMovePackageConnection>;
    /** Paginate all versions of this package before this one. */
    packageVersionsBefore?: Maybe<SuiMovePackageConnection>;
    /** The transaction that created this version of the object. */
    previousTransaction?: Maybe<SuiTransaction>;
    /** The transactions that sent objects to this object. */
    receivedTransactions?: Maybe<SuiTransactionConnection>;
    /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
    storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
    /** A table identifying which versions of a package introduced each of its types. */
    typeOrigins?: Maybe<Array<SuiTypeOrigin>>;
    /** The version of this package that this content comes from. */
    version?: Maybe<Scalars["UInt53"]["output"]>;
  };

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageModuleArgs = {
  name: Scalars["String"]["input"];
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageModulesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackagePackageAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackagePackageVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackagePackageVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A MovePackage is a kind of Object that represents code that has been published on-chain. It exposes information about its modules, type definitions, functions, and dependencies. */
export type SuiMovePackageReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiMovePackageConnection = {
  /** A list of edges. */
  edges: Array<SuiMovePackageEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMovePackage>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMovePackageEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMovePackage;
};

/** Description of a struct type, defined in a Move module. */
export type SuiMoveStruct = SuiIMoveDatatype & {
  /** Abilities on this struct definition. */
  abilities?: Maybe<Array<SuiMoveAbility>>;
  /**
   * The names and types of the struct's fields.
   *
   * Field types reference type parameters by their index in the defining struct's `typeParameters` list.
   */
  fields?: Maybe<Array<SuiMoveField>>;
  /** The struct's fully-qualified name, including package address, module name, and datatype name. */
  fullyQualifiedName: Scalars["String"]["output"];
  /** The module that this struct is defined in. */
  module: SuiMoveModule;
  /** The struct's unqualified name. */
  name: Scalars["String"]["output"];
  /**
   * Constraints on the struct's formal type parameters.
   *
   * Move bytecode does not name type parameters, so when they are referenced (e.g. in field types), they are identified by their index in this list.
   */
  typeParameters?: Maybe<Array<SuiMoveDatatypeTypeParameter>>;
};

export type SuiMoveStructConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveStructEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveStruct>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveStructEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveStruct;
};

/** Represents instances of concrete types (no type parameters, no references). */
export type SuiMoveType = {
  /** The abilities this concrete type has. Returns no abilities if the type is invalid. */
  abilities?: Maybe<Array<SuiMoveAbility>>;
  /**
   * Structured representation of the "shape" of values that match this type. May return no
   * layout if the type is invalid.
   */
  layout?: Maybe<Scalars["MoveTypeLayout"]["output"]>;
  /** Flat representation of the type signature, as a displayable string. */
  repr: Scalars["String"]["output"];
  /** Structured representation of the type signature. */
  signature: Scalars["MoveTypeSignature"]["output"];
};

export type SuiMoveValue = {
  /**
   * Attempts to treat this value as an `Address`.
   *
   * If the value is of type `address` or `0x2::object::ID`, it is interpreted as an address pointer, and it is scoped to the current checkpoint.
   *
   * If the value is of type `0x2::object::UID`, it is interpreted as a wrapped object whose version is bounded by the root version of the current value. Such values do not support nested owned object queries, but `Address.addressAt` can be used to re-scope it to a checkpoint (defaults to the current checkpoint), instead of a root version, allowing owned object queries.
   *
   * Values of other types cannot be interpreted as addresses, and `null` is returned.
   */
  asAddress?: Maybe<SuiAddress>;
  /**
   * Attempts to treat this value as a `vector<T>` and paginate over its elements.
   *
   * Values of other types cannot be interpreted as vectors, and `null` is returned.
   */
  asVector?: Maybe<SuiMoveValueConnection>;
  /** The BCS representation of this value, Base64-encoded. */
  bcs?: Maybe<Scalars["Base64"]["output"]>;
  /**
   * A rendered JSON blob based on an on-chain template, substituted with data from this value.
   *
   * Returns `null` if the value's type does not have an associated `Display` template.
   */
  display?: Maybe<SuiDisplay>;
  /**
   * Extract a nested value at the given path.
   *
   * `path` is a Display v2 'chain' expression, allowing access to nested, named and positional fields, vector indices, VecMap keys, and dynamic (object) field accesses.
   */
  extract?: Maybe<SuiMoveValue>;
  /**
   * Render a single Display v2 format string against this value.
   *
   * Returns `null` if the value does not have a valid type, or if any of the expressions in the format string fail to evaluate (e.g. field does not exist).
   */
  format?: Maybe<Scalars["JSON"]["output"]>;
  /**
   * Representation of a Move value in JSON, where:
   *
   * - Addresses, IDs, and UIDs are represented in canonical form, as JSON strings.
   * - Bools are represented by JSON boolean literals.
   * - u8, u16, and u32 are represented as JSON numbers.
   * - u64, u128, and u256 are represented as JSON strings.
   * - Balances, Strings, and Urls are represented as JSON strings.
   * - Vectors of bytes are represented as Base64 blobs, and other vectors are represented by JSON arrays.
   * - Structs are represented by JSON objects.
   * - Enums are represented by JSON objects, with a field named `@variant` containing the variant name.
   * - Empty optional values are represented by `null`.
   */
  json?: Maybe<Scalars["JSON"]["output"]>;
  /** The value's type. */
  type?: Maybe<SuiMoveType>;
};

export type SuiMoveValueAsVectorArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiMoveValueExtractArgs = {
  path: Scalars["String"]["input"];
};

export type SuiMoveValueFormatArgs = {
  format: Scalars["String"]["input"];
};

export type SuiMoveValueConnection = {
  /** A list of edges. */
  edges: Array<SuiMoveValueEdge>;
  /** A list of nodes. */
  nodes: Array<SuiMoveValue>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiMoveValueEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiMoveValue;
};

/**
 * The visibility modifier describes which modules can access this module member.
 *
 * By default, a module member can be called only within the same module.
 */
export enum SuiMoveVisibility {
  /** A friend member can be accessed in the module it is defined in and any other module in its package that is explicitly specified in its friend list. */
  Friend = "FRIEND",
  /** A private member can be accessed in the module it is defined in. */
  Private = "PRIVATE",
  /** A public member can be accessed by any module. */
  Public = "PUBLIC",
}

/** The multisig committee definition. */
export type SuiMultisigCommittee = {
  /** The committee members (public key + weight). */
  members?: Maybe<Array<SuiMultisigMember>>;
  /** The threshold number of weight needed for a valid multisig. */
  threshold?: Maybe<Scalars["Int"]["output"]>;
};

/** A single member of a multisig committee. */
export type SuiMultisigMember = {
  /** The member's public key. */
  publicKey?: Maybe<SuiMultisigMemberPublicKey>;
  /** The member's weight in the committee. */
  weight?: Maybe<Scalars["Int"]["output"]>;
};

/** A multisig member's public key, varying by scheme. */
export type SuiMultisigMemberPublicKey =
  | SuiEd25519PublicKey
  | SuiPasskeyPublicKey
  | SuiSecp256K1PublicKey
  | SuiSecp256R1PublicKey
  | SuiZkLoginPublicIdentifier;

/** An aggregated multisig signature. */
export type SuiMultisigSignature = {
  /** A bitmap indicating which members of the committee signed. */
  bitmap?: Maybe<Scalars["Int"]["output"]>;
  /** The multisig committee (public keys + weights + threshold). */
  committee?: Maybe<SuiMultisigCommittee>;
  /**
   * The individual member signatures, one per signer who participated.
   * Compressed signatures within a multisig do not include the signer's public key,
   * so `publicKey` will be `null` for simple signature schemes (Ed25519, Secp256k1, Secp256r1).
   */
  signatures?: Maybe<Array<SuiSignatureScheme>>;
};

/** A transaction that wanted to mutate a consensus-managed object but couldn't because it became not-consensus-managed before the transaction executed (for example, it was deleted, turned into an owned object, or wrapped). */
export type SuiMutateConsensusStreamEnded = {
  /** The ID of the consensus-managed object. */
  address?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** The sequence number associated with the consensus stream ending. */
  sequenceNumber?: Maybe<Scalars["UInt53"]["output"]>;
};

/** Mutations are used to write to the Sui network. */
export type SuiMutation = {
  /**
   * Execute a transaction, committing its effects on chain.
   *
   * - `transactionDataBcs` contains the BCS-encoded transaction data (Base64-encoded).
   * - `signatures` are a list of `flag || signature || pubkey` bytes, Base64-encoded.
   *
   * Waits until the transaction has reached finality on chain to return its transaction digest, or returns the error that prevented finality if that was not possible. A transaction is final when its effects are guaranteed on chain (it cannot be revoked).
   *
   * There may be a delay between transaction finality and when GraphQL requests (including the request that issued the transaction) reflect its effects. As a result, queries that depend on indexing the state of the chain (e.g. contents of output objects, address-level balance information at the time of the transaction), must wait for indexing to catch up by polling for the transaction digest using `Query.transaction`.
   */
  executeTransaction: SuiExecutionResult;
};

/** Mutations are used to write to the Sui network. */
export type SuiMutationExecuteTransactionArgs = {
  signatures: Array<Scalars["Base64"]["input"]>;
  transactionDataBcs: Scalars["Base64"]["input"];
};

/** A Name Service NameRecord representing a domain name registration. */
export type SuiNameRecord = {
  /** On-chain representation of the underlying Name Service `NameRecord` Move value. */
  contents: SuiMoveValue;
  /** The domain name this record is for. */
  domain: Scalars["String"]["output"];
  /**
   * The Name Service Name Record of the parent domain, if this is a subdomain.
   *
   * Returns `null` if this is not a subdomain.
   */
  parent?: Maybe<SuiNameRecord>;
  /**
   * The address this domain points to.
   *
   * `rootVersion` and `atCheckpoint` control how the target `Address` is scoped. If neither is provided, the `Address` is scoped to the latest checkpoint known to the RPC.
   */
  target?: Maybe<SuiAddress>;
};

/** A Name Service NameRecord representing a domain name registration. */
export type SuiNameRecordTargetArgs = {
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** An interface implemented by types that can be uniquely identified by a globally unique `ID`, following the GraphQL Global Object Identification specification. */
export type SuiNode = {
  /** The node's globally unique identifier, which can be passed to `Query.node` to refetch it. */
  id: Scalars["ID"]["output"];
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObject = SuiIAddressable &
  SuiIObject &
  SuiNode & {
    /** The Object's ID. */
    address: Scalars["SuiAddress"]["output"];
    /**
     * Fetch the address as it was at a different root version, or checkpoint.
     *
     * If no additional bound is provided, the address is fetched at the latest checkpoint known to the RPC.
     */
    addressAt?: Maybe<SuiAddress>;
    /** Attempts to convert the object into a MoveObject. */
    asMoveObject?: Maybe<SuiMoveObject>;
    /** Attempts to convert the object into a MovePackage. */
    asMovePackage?: Maybe<SuiMovePackage>;
    /**
     * Fetch the total balance for coins with marker type `coinType` (e.g. `0x2::sui::SUI`), owned by this address.
     *
     * If the address does not own any coins of that type, a balance of zero is returned.
     */
    balance?: Maybe<SuiBalance>;
    /** Total balance across coins owned by this address, grouped by coin type. */
    balances?: Maybe<SuiBalanceConnection>;
    /** The domain explicitly configured as the default Name Service name for this address. */
    defaultNameRecord?: Maybe<SuiNameRecord>;
    /** 32-byte hash that identifies the object's contents, encoded in Base58. */
    digest?: Maybe<Scalars["String"]["output"]>;
    /**
     * Access a dynamic field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic field with that name could not be found attached to this object.
     */
    dynamicField?: Maybe<SuiDynamicField>;
    /** Dynamic fields owned by this object. */
    dynamicFields?: Maybe<SuiDynamicFieldConnection>;
    /**
     * Access a dynamic object field on an object using its type and BCS-encoded name.
     *
     * Returns `null` if a dynamic object field with that name could not be found attached to this object.
     */
    dynamicObjectField?: Maybe<SuiDynamicField>;
    /** The object's globally unique identifier, which can be passed to `Query.node` to refetch it. */
    id: Scalars["ID"]["output"];
    /**
     * Fetch the total balances keyed by coin types (e.g. `0x2::sui::SUI`) owned by this address.
     *
     * Returns `None` when no checkpoint is set in scope (e.g. execution scope).
     * If the address does not own any coins of a given type, a balance of zero is returned for that type.
     */
    multiGetBalances?: Maybe<Array<SuiBalance>>;
    /**
     * Access dynamic fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic fields that is guaranteed to be the same length as `keys`. If a dynamic field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Access dynamic object fields on an object using their types and BCS-encoded names.
     *
     * Returns a list of dynamic object fields that is guaranteed to be the same length as `keys`. If a dynamic object field in `keys` could not be found in the store, its corresponding entry in the result will be `null`.
     */
    multiGetDynamicObjectFields: Array<Maybe<SuiDynamicField>>;
    /**
     * Fetch the object with the same ID, at a different version, root version bound, or checkpoint.
     *
     * If no additional bound is provided, the object is fetched at the latest checkpoint known to the RPC.
     */
    objectAt?: Maybe<SuiObject>;
    /** The Base64-encoded BCS serialization of this object, as an `Object`. */
    objectBcs?: Maybe<Scalars["Base64"]["output"]>;
    /** Paginate all versions of this object after this one. */
    objectVersionsAfter?: Maybe<SuiObjectConnection>;
    /** Paginate all versions of this object before this one. */
    objectVersionsBefore?: Maybe<SuiObjectConnection>;
    /** Objects owned by this object, optionally filtered by type. */
    objects?: Maybe<SuiMoveObjectConnection>;
    /** The object's owner kind. */
    owner?: Maybe<SuiOwner>;
    /** The transaction that created this version of the object. */
    previousTransaction?: Maybe<SuiTransaction>;
    /** The transactions that sent objects to this object */
    receivedTransactions?: Maybe<SuiTransactionConnection>;
    /** The SUI returned to the sponsor or sender of the transaction that modifies or deletes this object. */
    storageRebate?: Maybe<Scalars["BigInt"]["output"]>;
    /** The version of this object that this content comes from. */
    version?: Maybe<Scalars["UInt53"]["output"]>;
  };

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectAddressAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectBalanceArgs = {
  coinType: Scalars["String"]["input"];
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectBalancesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectDynamicFieldArgs = {
  name: SuiDynamicFieldName;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectDynamicFieldsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectDynamicObjectFieldArgs = {
  name: SuiDynamicFieldName;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectMultiGetBalancesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectMultiGetDynamicFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectMultiGetDynamicObjectFieldsArgs = {
  keys: Array<SuiDynamicFieldName>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectObjectAtArgs = {
  checkpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectObjectVersionsAfterArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectObjectVersionsBeforeArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiObjectFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * An Object on Sui is either a typed value (a Move Object) or a Package (modules containing functions and types).
 *
 * Every object on Sui is identified by a unique address, and has a version number that increases with every modification. Objects also hold metadata detailing their current owner (who can sign for access to the object and whether that access can modify and/or delete the object), and the digest of the last transaction that modified the object.
 */
export type SuiObjectReceivedTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiObjectChange = {
  /** The address of the object that has changed. */
  address: Scalars["SuiAddress"]["output"];
  /** Whether the ID was created in this transaction. */
  idCreated?: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the ID was deleted in this transaction. */
  idDeleted?: Maybe<Scalars["Boolean"]["output"]>;
  /** The contents of the object immediately before the transaction. */
  inputState?: Maybe<SuiObject>;
  /** The contents of the object immediately after the transaction. */
  outputState?: Maybe<SuiObject>;
};

export type SuiObjectChangeConnection = {
  /** A list of edges. */
  edges: Array<SuiObjectChangeEdge>;
  /** A list of nodes. */
  nodes: Array<SuiObjectChange>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiObjectChangeEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiObjectChange;
};

export type SuiObjectConnection = {
  /** A list of edges. */
  edges: Array<SuiObjectEdge>;
  /** A list of nodes. */
  nodes: Array<SuiObject>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiObjectEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiObject;
};

/**
 * A filter over the live object set, the filter can be one of:
 *
 * - A filter on type (all live objects whose type matches that filter).
 * - Fetching all objects owned by an address or object, optionally filtered by type.
 * - Fetching all shared or immutable objects, filtered by type.
 */
export type SuiObjectFilter = {
  /**
   * Specifies the address of the owning address or object.
   *
   * This field is required if `ownerKind` is "ADDRESS" or "OBJECT". If provided without `ownerKind`, `ownerKind` defaults to "ADDRESS".
   */
  owner?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  /**
   * Filter on whether the object is address-owned, object-owned, shared, or immutable.
   *
   * - If this field is set to "ADDRESS" or "OBJECT", then an owner filter must also be provided.
   * - If this field is set to "SHARED" or "IMMUTABLE", then a type filter must also be provided.
   */
  ownerKind?: InputMaybe<SuiOwnerKind>;
  /**
   * Filter on the object's type.
   *
   * The filter can be one of:
   *
   * - A package address: `0x2`,
   * - A module: `0x2::coin`,
   * - A fully-qualified name: `0x2::coin::Coin`,
   * - A type instantiation: `0x2::coin::Coin<0x2::sui::SUI>`.
   */
  type?: InputMaybe<Scalars["String"]["input"]>;
};

/**
 * Identifies a specific version of an object.
 *
 * The `address` field must be specified, as well as at most one of `version`, `rootVersion`, or `atCheckpoint`. If none are provided, the object is fetched at the current checkpoint.
 *
 * Specifying a `version` or a `rootVersion` disables nested queries for paginating owned objects or dynamic fields (these queries are only supported at checkpoint boundaries).
 *
 * See `Query.object` for more details.
 */
export type SuiObjectKey = {
  /** The object's ID. */
  address: Scalars["SuiAddress"]["input"];
  /** If specified, tries to fetch the latest version as of this checkpoint. Fails if the checkpoint is later than the RPC's latest checkpoint. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /**
   * If specified, tries to fetch the latest version of the object at or before this version. Nested dynamic field accesses will also be subject to this bound.
   *
   * This can be used to fetch a child or ancestor object bounded by its root object's version. For any wrapped or child (object-owned) object, its root object can be defined recursively as:
   *
   * - The root object of the object it is wrapped in, if it is wrapped.
   * - The root object of its owner, if it is owned by another object.
   * - The object itself, if it is not object-owned or wrapped.
   */
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** If specified, tries to fetch the object at this exact version. */
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** Object is exclusively owned by a single object, and is mutable. Note that the owning object may be inaccessible because it is wrapped. */
export type SuiObjectOwner = {
  /** The owner's address. */
  address?: Maybe<SuiAddress>;
};

/**
 * Represents types that could contain references or free type parameters.  Such types can appear
 * as function parameters, in fields of structs, or as actual type parameter.
 */
export type SuiOpenMoveType = {
  /** Flat representation of the type signature, as a displayable string. */
  repr: Scalars["String"]["output"];
  /** Structured representation of the type signature. */
  signature: Scalars["OpenMoveTypeSignature"]["output"];
};

/** Placeholder for unimplemented command types */
export type SuiOtherCommand = {
  /** Placeholder field for unimplemented commands */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** A Move object, either immutable, or owned mutable. */
export type SuiOwnedOrImmutable = {
  object?: Maybe<SuiObject>;
};

/** The object's owner kind. */
export type SuiOwner =
  | SuiAddressOwner
  | SuiConsensusAddressOwner
  | SuiImmutable
  | SuiObjectOwner
  | SuiShared;

/** Filter on who owns an object. */
export enum SuiOwnerKind {
  /** Object is owned by an address. */
  Address = "ADDRESS",
  /** Object is frozen. */
  Immutable = "IMMUTABLE",
  /** Object is a child of another object (e.g. a dynamic field or dynamic object field). */
  Object = "OBJECT",
  /** Object is shared among multiple owners. */
  Shared = "SHARED",
}

/** Filter for paginating packages published within a range of checkpoints. */
export type SuiPackageCheckpointFilter = {
  /** Filter to packages that were published strictly after this checkpoint, defaults to fetching from the earliest checkpoint known to this RPC (this could be the genesis checkpoint, or some later checkpoint if data has been pruned). */
  afterCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Filter to packages published strictly before this checkpoint, defaults to fetching up to the latest checkpoint (inclusive). */
  beforeCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/**
 * Identifies a specific version of a package.
 *
 * The `address` field must be specified, as well as at most one of `version`, or `atCheckpoint`. If neither is provided, the package is fetched at the checkpoint being viewed.
 *
 * See `Query.package` for more details.
 */
export type SuiPackageKey = {
  /** The object's ID. */
  address: Scalars["SuiAddress"]["input"];
  /** If specified, tries to fetch the latest version as of this checkpoint. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** If specified, tries to fetch the package at this exact version. */
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** Information about pagination in a connection */
export type SuiPageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars["String"]["output"]>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars["Boolean"]["output"];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars["Boolean"]["output"];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

/** A Passkey public key. */
export type SuiPasskeyPublicKey = {
  /** The raw public key bytes. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
};

export type SuiPasskeySignature = {
  /** The authenticator data returned by the passkey device. */
  authenticatorData?: Maybe<Scalars["Base64"]["output"]>;
  /** The client data JSON string passed to the authenticator. */
  clientDataJson?: Maybe<Scalars["String"]["output"]>;
  /** The inner user signature (secp256r1). */
  signature?: Maybe<SuiSignatureScheme>;
};

export type SuiPerEpochConfig = {
  /** The per-epoch configuration object as of when the transaction was executed. */
  object?: Maybe<SuiObject>;
};

/** ProgrammableSystemTransaction is identical to ProgrammableTransaction, but GraphQL does not allow multiple variants with the same type. */
export type SuiProgrammableSystemTransaction = {
  /** The transaction commands, executed sequentially. */
  commands?: Maybe<SuiCommandConnection>;
  /** Input objects or primitive values. */
  inputs?: Maybe<SuiTransactionInputConnection>;
};

/** ProgrammableSystemTransaction is identical to ProgrammableTransaction, but GraphQL does not allow multiple variants with the same type. */
export type SuiProgrammableSystemTransactionCommandsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** ProgrammableSystemTransaction is identical to ProgrammableTransaction, but GraphQL does not allow multiple variants with the same type. */
export type SuiProgrammableSystemTransactionInputsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiProgrammableTransaction = {
  /** The transaction commands, executed sequentially. */
  commands?: Maybe<SuiCommandConnection>;
  /** Input objects or primitive values. */
  inputs?: Maybe<SuiTransactionInputConnection>;
};

export type SuiProgrammableTransactionCommandsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiProgrammableTransactionInputsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** A protocol configuration that can hold an arbitrary value (or no value at all). */
export type SuiProtocolConfig = {
  /** Configuration name. */
  key: Scalars["String"]["output"];
  /** Configuration value. */
  value?: Maybe<Scalars["String"]["output"]>;
};

/**
 * Constants that control how the chain operates.
 *
 * These can only change during protocol upgrades which happen on epoch boundaries. Configuration is split into feature flags (which are just booleans), and configs which can take any value (including no value at all), and will be represented by a string.
 */
export type SuiProtocolConfigs = {
  /** Query for the value of the configuration with name `key`. */
  config?: Maybe<SuiProtocolConfig>;
  /** List all available configurations and their values. */
  configs: Array<SuiProtocolConfig>;
  /** Query for the state of the feature flag with name `key`. */
  featureFlag?: Maybe<SuiFeatureFlag>;
  /** List all available feature flags and their values. */
  featureFlags: Array<SuiFeatureFlag>;
  protocolVersion: Scalars["UInt53"]["output"];
};

/**
 * Constants that control how the chain operates.
 *
 * These can only change during protocol upgrades which happen on epoch boundaries. Configuration is split into feature flags (which are just booleans), and configs which can take any value (including no value at all), and will be represented by a string.
 */
export type SuiProtocolConfigsConfigArgs = {
  key: Scalars["String"]["input"];
};

/**
 * Constants that control how the chain operates.
 *
 * These can only change during protocol upgrades which happen on epoch boundaries. Configuration is split into feature flags (which are just booleans), and configs which can take any value (including no value at all), and will be represented by a string.
 */
export type SuiProtocolConfigsFeatureFlagArgs = {
  key: Scalars["String"]["input"];
};

/** Publishes a Move Package. */
export type SuiPublishCommand = {
  /** IDs of the transitive dependencies of the package to be published. */
  dependencies?: Maybe<Array<Scalars["SuiAddress"]["output"]>>;
  /** Bytecode for the modules to be published, BCS serialized and Base64 encoded. */
  modules?: Maybe<Array<Scalars["Base64"]["output"]>>;
};

/** BCS encoded primitive value (not an object or Move struct). */
export type SuiPure = {
  /** BCS serialized and Base64 encoded primitive value. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
};

export type SuiQuery = {
  /**
   * Look-up an account by its SuiAddress.
   *
   * If `rootVersion` is specified, nested dynamic field accesses will be fetched at or before this version. This can be used to fetch a child or descendant object bounded by its root object's version, when its immediate parent is wrapped, or a value in a dynamic object field. For any wrapped or child (object-owned) object, its root object can be defined recursively as:
   *
   * - The root object of the object it is wrapped in, if it is wrapped.
   * - The root object of its owner, if it is owned by another object.
   * - The object itself, if it is not object-owned or wrapped.
   *
   * Specifying a `rootVersion` disables nested queries for paginating owned objects or dynamic fields (these queries are only supported at checkpoint boundaries).
   *
   * If `atCheckpoint` is specified, the address will be fetched at the latest version as of this checkpoint. This will fail if the provided checkpoint is after the RPC's latest checkpoint.
   *
   * If none of the above are specified, the address is fetched at the checkpoint being viewed.
   *
   * If the address is fetched by name and the name does not resolve to an address (e.g. the name does not exist or has expired), `null` is returned.
   */
  address?: Maybe<SuiAddress>;
  /** The network's genesis checkpoint digest (uniquely identifies the network), Base58-encoded. */
  chainIdentifier: Scalars["String"]["output"];
  /**
   * Fetch a checkpoint by its sequence number, or the latest checkpoint if no sequence number is provided.
   *
   * Returns `null` if the checkpoint does not exist in the store, either because it never existed or because it was pruned.
   */
  checkpoint?: Maybe<SuiCheckpoint>;
  /** Paginate checkpoints in the network, optionally bounded to checkpoints in the given epoch. */
  checkpoints?: Maybe<SuiCheckpointConnection>;
  /**
   * Fetch the CoinMetadata for a given coin type.
   *
   * Returns `null` if no CoinMetadata object exists for the given coin type.
   */
  coinMetadata?: Maybe<SuiCoinMetadata>;
  /**
   * Fetch an epoch by its ID, or fetch the latest epoch if no ID is provided.
   *
   * Returns `null` if the epoch does not exist yet, or was pruned.
   */
  epoch?: Maybe<SuiEpoch>;
  /** Paginate epochs that are in the network. */
  epochs?: Maybe<SuiEpochConnection>;
  /** Paginate events that are emitted in the network, optionally filtered by event filters. */
  events?: Maybe<SuiEventConnection>;
  /**
   * Fetch addresses by their keys.
   *
   * Returns a list of addresses that is guaranteed to be the same length as `keys`. If an address in `keys` is fetched by name and the name does not resolve to an address, its corresponding entry in the result will be `null`.
   */
  multiGetAddresses: Array<Maybe<SuiAddress>>;
  /**
   * Fetch checkpoints by their sequence numbers.
   *
   * Returns a list of checkpoints that is guaranteed to be the same length as `keys`. If a checkpoint in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because the checkpoint does not exist yet, or because it was pruned.
   */
  multiGetCheckpoints: Array<Maybe<SuiCheckpoint>>;
  /**
   * Fetch epochs by their IDs.
   *
   * Returns a list of epochs that is guaranteed to be the same length as `keys`. If an epoch in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because the epoch does not exist yet, or because it was pruned.
   */
  multiGetEpochs: Array<Maybe<SuiEpoch>>;
  /**
   * Fetch objects by their keys.
   *
   * Returns a list of objects that is guaranteed to be the same length as `keys`. If an object in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because the object never existed, or because it was pruned.
   */
  multiGetObjects: Array<Maybe<SuiObject>>;
  /**
   * Fetch packages by their keys.
   *
   * Returns a list of packages that is guaranteed to be the same length as `keys`. If a package in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because that address never pointed to a package, or because the package was pruned.
   */
  multiGetPackages: Array<Maybe<SuiMovePackage>>;
  /**
   * Fetch transaction effects by their transactions' digests.
   *
   * Returns a list of transaction effects that is guaranteed to be the same length as `keys`. If a digest in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because the transaction effects never existed, or because it was pruned.
   */
  multiGetTransactionEffects: Array<Maybe<SuiTransactionEffects>>;
  /**
   * Fetch transactions by their digests.
   *
   * Returns a list of transactions that is guaranteed to be the same length as `keys`. If a digest in `keys` could not be found in the store, its corresponding entry in the result will be `null`. This could be because the transaction never existed, or because it was pruned.
   */
  multiGetTransactions: Array<Maybe<SuiTransaction>>;
  /**
   * Fetch types by their string representations.
   *
   * Types are canonicalized: In the input they can be at any package address at or after the package that first defines them, and in the output they will be relocated to the package that first defines them.
   *
   * Returns a list of types that is guaranteed to be the same length as `keys`. If a type in `keys` could not be found, its corresponding entry in the result will be `null`.
   */
  multiGetTypes: Array<Maybe<SuiMoveType>>;
  /**
   * Look-up a Name Service NameRecord by its domain name.
   *
   * Returns `null` if the record does not exist or has expired.
   */
  nameRecord?: Maybe<SuiNameRecord>;
  /** Fetch a `Node` by its globally unique `ID`. Returns `null` if the node cannot be found (e.g., the underlying data was pruned or never existed). */
  node?: Maybe<SuiNode>;
  /**
   * Fetch an object by its address.
   *
   * If `version` is specified, the object will be fetched at that exact version.
   *
   * If `rootVersion` is specified, the object will be fetched at the latest version at or before this version. Nested dynamic field accesses will also be subject to this bound. This can be used to fetch a child or ancestor object bounded by its root object's version. For any wrapped or child (object-owned) object, its root object can be defined recursively as:
   *
   * - The root object of the object it is wrapped in, if it is wrapped.
   * - The root object of its owner, if it is owned by another object.
   * - The object itself, if it is not object-owned or wrapped.
   *
   * Specifying a `version` or a `rootVersion` disables nested queries for paginating owned objects or dynamic fields (these queries are only supported at checkpoint boundaries).
   *
   * If `atCheckpoint` is specified, the object will be fetched at the latest version as of this checkpoint. This will fail if the provided checkpoint is after the RPC's latest checkpoint.
   *
   * If none of the above are specified, the object is fetched at the checkpoint being viewed.
   *
   * It is an error to specify more than one of `version`, `rootVersion`, or `atCheckpoint`.
   *
   * Returns `null` if an object cannot be found that meets this criteria.
   */
  object?: Maybe<SuiObject>;
  /** Paginate all versions of an object at `address`, optionally bounding the versions exclusively from below with `filter.afterVersion` or from above with `filter.beforeVersion`. */
  objectVersions?: Maybe<SuiObjectConnection>;
  /**
   * Paginate objects in the live object set, optionally filtered by owner and/or type. `filter` can be one of:
   *
   * - A filter on type (all live objects whose type matches that filter).
   * - Fetching all objects owned by an address or object, optionally filtered by type.
   * - Fetching all shared or immutable objects, filtered by type.
   */
  objects?: Maybe<SuiObjectConnection>;
  /**
   * Fetch a package by its address.
   *
   * If `version` is specified, the package loaded is the one that shares its original ID with the package at `address`, but whose version is `version`.
   *
   * If `atCheckpoint` is specified, the package loaded is the one with the largest version among all packages sharing an original ID with the package at `address` and was published at or before `atCheckpoint`.
   *
   * If neither are specified, the package is fetched at the checkpoint being viewed.
   *
   * It is an error to specify both `version` and `atCheckpoint`, and `null` will be returned if the package cannot be found as of the latest checkpoint, or the address points to an object that is not a package.
   *
   * Note that this interpretation of `version` and "latest" differs from the one used by `Query.object`, because non-system package upgrades generate objects with different IDs. To fetch a package using the versioning semantics of objects, use `Object.asMovePackage` nested under `Query.object`.
   */
  package?: Maybe<SuiMovePackage>;
  /**
   * Paginate all versions of a package at `address`, optionally bounding the versions exclusively from below with `filter.afterVersion` or from above with `filter.beforeVersion`.
   *
   * Different versions of a package will have different object IDs, unless they are system packages, but will share the same original ID.
   */
  packageVersions?: Maybe<SuiMovePackageConnection>;
  /** Paginate all packages published on-chain, optionally bounded to packages published strictly after `filter.afterCheckpoint` and/or strictly before `filter.beforeCheckpoint`. */
  packages?: Maybe<SuiMovePackageConnection>;
  /** Fetch the protocol config by protocol version, or the latest protocol config used on chain if no version is provided. */
  protocolConfigs?: Maybe<SuiProtocolConfigs>;
  /** Configuration for this RPC service. */
  serviceConfig: SuiServiceConfig;
  /**
   * Simulate a transaction to preview its effects without executing it on chain.
   *
   * Accepts a JSON transaction matching the [Sui gRPC API schema](https://docs.sui.io/references/fullnode-protocol#sui-rpc-v2-Transaction).
   * The JSON format allows for partial transaction specification where certain fields can be automatically resolved by the server.
   *
   * Alternatively, for already serialized transactions, you can pass BCS-encoded data:
   * `{"bcs": {"value": "<base64>"}}`
   *
   * Unlike `executeTransaction`, this does not require signatures since the transaction is not committed to the blockchain. This allows for previewing transaction effects, estimating gas costs, and testing transaction logic without spending gas or requiring valid signatures.
   *
   * - `checksEnabled`: If true, enables transaction validation checks during simulation. Defaults to true.
   * - `doGasSelection`: If true, enables automatic gas coin selection and budget estimation. Defaults to false.
   */
  simulateTransaction: SuiSimulationResult;
  /**
   * Fetch a transaction by its digest.
   *
   * Returns `null` if the transaction does not exist in the store, either because it never existed or because it was pruned.
   */
  transaction?: Maybe<SuiTransaction>;
  /**
   * Fetch transaction effects by its transaction's digest.
   *
   * Returns `null` if the transaction effects do not exist in the store, either because that transaction was not executed, or it was pruned.
   */
  transactionEffects?: Maybe<SuiTransactionEffects>;
  /** The transactions that exist in the network, optionally filtered by transaction filters. */
  transactions?: Maybe<SuiTransactionConnection>;
  /**
   * Fetch a structured representation of a concrete type, including its layout information.
   *
   * Types are canonicalized: In the input they can be at any package address at or after the package that first defines them, and in the output they will be relocated to the package that first defines them.
   *
   * Fails if the type is malformed, returns `null` if a type mentioned does not exist.
   */
  type?: Maybe<SuiMoveType>;
  /**
   * Verify a zkLogin signature is from the given `author`.
   *
   * Returns successfully if the signature is valid. If the signature is invalid, returns an error with the reason for the failure.
   *
   * - `bytes` are either the bytes of a serialized personal message, or `TransactionData`, Base64-encoded.
   * - `signature` is a serialized zkLogin signature, also Base64-encoded.
   * - `intentScope` indicates whether `bytes` are to be parsed as a personal message or `TransactionData`.
   * - `author` is the signer's address.
   */
  verifyZkLoginSignature?: Maybe<SuiZkLoginVerifyResult>;
};

export type SuiQueryAddressArgs = {
  address?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQueryCheckpointArgs = {
  sequenceNumber?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQueryCheckpointsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiCheckpointFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryCoinMetadataArgs = {
  coinType: Scalars["String"]["input"];
};

export type SuiQueryEpochArgs = {
  epochId?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQueryEpochsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryEventsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiEventFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryMultiGetAddressesArgs = {
  keys: Array<SuiAddressKey>;
};

export type SuiQueryMultiGetCheckpointsArgs = {
  keys: Array<Scalars["UInt53"]["input"]>;
};

export type SuiQueryMultiGetEpochsArgs = {
  keys: Array<Scalars["UInt53"]["input"]>;
};

export type SuiQueryMultiGetObjectsArgs = {
  keys: Array<SuiObjectKey>;
};

export type SuiQueryMultiGetPackagesArgs = {
  keys: Array<SuiPackageKey>;
};

export type SuiQueryMultiGetTransactionEffectsArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

export type SuiQueryMultiGetTransactionsArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

export type SuiQueryMultiGetTypesArgs = {
  keys: Array<Scalars["String"]["input"]>;
};

export type SuiQueryNameRecordArgs = {
  name: Scalars["String"]["input"];
};

export type SuiQueryNodeArgs = {
  id: Scalars["ID"]["input"];
};

export type SuiQueryObjectArgs = {
  address: Scalars["SuiAddress"]["input"];
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  rootVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQueryObjectVersionsArgs = {
  address: Scalars["SuiAddress"]["input"];
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter: SuiObjectFilter;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryPackageArgs = {
  address: Scalars["SuiAddress"]["input"];
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQueryPackageVersionsArgs = {
  address: Scalars["SuiAddress"]["input"];
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiVersionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryPackagesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiPackageCheckpointFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryProtocolConfigsArgs = {
  version?: InputMaybe<Scalars["UInt53"]["input"]>;
};

export type SuiQuerySimulateTransactionArgs = {
  checksEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  doGasSelection?: InputMaybe<Scalars["Boolean"]["input"]>;
  transaction: Scalars["JSON"]["input"];
};

export type SuiQueryTransactionArgs = {
  digest: Scalars["String"]["input"];
};

export type SuiQueryTransactionEffectsArgs = {
  digest: Scalars["String"]["input"];
};

export type SuiQueryTransactionsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<SuiTransactionFilter>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiQueryTypeArgs = {
  type: Scalars["String"]["input"];
};

export type SuiQueryVerifyZkLoginSignatureArgs = {
  author: Scalars["SuiAddress"]["input"];
  bytes: Scalars["Base64"]["input"];
  intentScope: SuiZkLoginIntentScope;
  signature: Scalars["Base64"]["input"];
};

/** System transaction for creating the on-chain randomness state. */
export type SuiRandomnessStateCreateTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** System transaction to update the source of on-chain randomness. */
export type SuiRandomnessStateUpdateTransaction = {
  /** Epoch of the randomness state update transaction. */
  epoch?: Maybe<Scalars["Int"]["output"]>;
  /** Updated random bytes, Base64 encoded. */
  randomBytes?: Maybe<Scalars["Base64"]["output"]>;
  /** The initial version of the randomness object that it was shared at. */
  randomnessObjInitialSharedVersion?: Maybe<Scalars["Int"]["output"]>;
  /** Randomness round of the update. */
  randomnessRound?: Maybe<Scalars["Int"]["output"]>;
};

/** A transaction that wanted to read a consensus-managed object but couldn't because it became not-consensus-managed before the transaction executed (for example, it was deleted, turned into an owned object, or wrapped). */
export type SuiReadConsensusStreamEnded = {
  /** The ID of the consensus-managed object. */
  address?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** The sequence number associated with the consensus stream ending. */
  sequenceNumber?: Maybe<Scalars["UInt53"]["output"]>;
};

/** A Move object that can be received in this transaction. */
export type SuiReceiving = {
  object?: Maybe<SuiObject>;
};

/** Whether the currency is regulated or not. */
export enum SuiRegulatedState {
  /** A `DenyCap` or a `RegulatedCoinMetadata` exists for this currency. */
  Regulated = "REGULATED",
  /** The currency was created without a deny list. */
  Unregulated = "UNREGULATED",
}

/** A Secp256k1 public key. */
export type SuiSecp256K1PublicKey = {
  /** The raw public key bytes. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
};

/** A Secp256k1 signature. */
export type SuiSecp256K1Signature = {
  /** The public key bytes. */
  publicKey?: Maybe<Scalars["Base64"]["output"]>;
  /** The raw signature bytes. */
  signature?: Maybe<Scalars["Base64"]["output"]>;
};

/** A Secp256r1 public key. */
export type SuiSecp256R1PublicKey = {
  /** The raw public key bytes. */
  bytes?: Maybe<Scalars["Base64"]["output"]>;
};

/** A Secp256r1 signature. */
export type SuiSecp256R1Signature = {
  /** The public key bytes. */
  publicKey?: Maybe<Scalars["Base64"]["output"]>;
  /** The raw signature bytes. */
  signature?: Maybe<Scalars["Base64"]["output"]>;
};

export type SuiServiceConfig = {
  /** Range of checkpoints for which data is available for a query type, field and optional filter. If filter is not provided, the strictest retention range for the query and type is returned. */
  availableRange: SuiAvailableRange;
  /**
   * Number of elements a paginated connection will return if a page size is not supplied.
   *
   * Accepts `type` and `field` arguments which identify the connection that is being queried. If the field in question is paginated, its default page size is returned. If it does not exist or is not paginated, `null` is returned.
   */
  defaultPageSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum output size of a disassembled MoveModule, in bytes. */
  maxDisassembledModuleSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum depth of nested field access supported in display outputs. */
  maxDisplayFieldDepth?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of components in a Display v2 format string. */
  maxDisplayFormatNodes?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of objects that can be loaded while evaluating a display. */
  maxDisplayObjectLoads?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum output size of a display output. */
  maxDisplayOutputSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum budget in bytes to spend when outputting a structured `MoveValue`. */
  maxMoveValueBound?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum nesting allowed in datatype fields when calculating the layout of a single type. */
  maxMoveValueDepth?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of elements that can be requested from a multi-get query. A request to fetch more keys will result in an error. */
  maxMultiGetSize?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Maximum number of estimated output nodes in a GraphQL response.
   *
   * The estimate is an upperbound of how many nodes there would be in the output assuming every requested field is present, paginated requests return full page sizes, and multi-get queries find all requested keys. Below is a worked example query:
   *
   * ```graphql
   * |  0: query {                            # 514 = total
   * |  1:   checkpoint {                     # 1
   * |  2:     sequenceNumber                 # 1
   * |  3:   }
   * |  4:
   * |  5:   multiGetObjects([$a, $b, $c]) {  # 1 (* 3)
   * |  6:     address                        # 3
   * |  7:     digest                         # 3
   * |  8:   }
   * |  9:
   * | 10:   # default page size is 20
   * | 11:   transactions {                   # 1 (* 20)
   * | 12:     pageInfo {                     # 1
   * | 13:       hasNextPage                  # 1
   * | 14:       endCursor                    # 1
   * | 15:     }
   * | 16:
   * | 17:     nodes                          # 1
   * | 18:     {                              # 20
   * | 19:       digest                       # 20
   * | 20:       effects {                    # 20
   * | 21:         objectChanges(first: 10) { # 20 (* 10)
   * | 22:           nodes                    # 20
   * | 23:           {                        # 200
   * | 24:             address                # 200
   * | 25:           }
   * | 26:         }
   * | 27:       }
   * | 28:     }
   * | 29:   }
   * | 30: }
   * ```
   */
  maxOutputNodes?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Maximum number of elements that can be requested from a paginated connection. A request to fetch more elements will result in an error.
   *
   * Accepts `type` and `field` arguments which identify the connection that is being queried. If the field in question is paginated, its max page size is returned. If it does not exist or is not paginated, `null` is returned.
   */
  maxPageSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum depth of a GraphQL query that can be accepted by this service. */
  maxQueryDepth?: Maybe<Scalars["Int"]["output"]>;
  /** The maximum number of nodes (field names) the service will accept in a single query. */
  maxQueryNodes?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum size in bytes of a single GraphQL request, excluding the elements covered by `maxTransactionPayloadSize`. */
  maxQueryPayloadSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of paginated fields that can return results in a single request. Queries on paginated fields that exceed this limit will return an error. */
  maxRichQueries?: Maybe<Scalars["Int"]["output"]>;
  /**
   * Maximum size in bytes allowed for the `txBytes` and `signatures` parameters of an `executeTransaction` or `simulateTransaction` field, or the `bytes` and `signature` parameters of a `verifyZkLoginSignature` field.
   *
   * This is cumulative across all matching fields in a single GraphQL request.
   */
  maxTransactionPayloadSize?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum amount of nesting among type arguments (type arguments nest when a type argument is itself generic and has arguments). */
  maxTypeArgumentDepth?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of type parameters a type can have. */
  maxTypeArgumentWidth?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum number of datatypes that need to be processed when calculating the layout of a single type. */
  maxTypeNodes?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum time in milliseconds spent waiting for a response from fullnode after issuing a transaction to execute. Note that the transaction may still succeed even in the case of a timeout. Transactions are idempotent, so a transaction that times out should be re-submitted until the network returns a definite response (success or failure, not timeout). */
  mutationTimeoutMs?: Maybe<Scalars["Int"]["output"]>;
  /** Maximum time in milliseconds that will be spent to serve one query request. */
  queryTimeoutMs?: Maybe<Scalars["Int"]["output"]>;
};

export type SuiServiceConfigAvailableRangeArgs = {
  field?: InputMaybe<Scalars["String"]["input"]>;
  filters?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type: Scalars["String"]["input"];
};

export type SuiServiceConfigDefaultPageSizeArgs = {
  field: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

export type SuiServiceConfigMaxPageSizeArgs = {
  field: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

/** Object is shared, can be used by any address, and is mutable. */
export type SuiShared = {
  /** The version at which the object became shared. */
  initialSharedVersion?: Maybe<Scalars["UInt53"]["output"]>;
};

/** A Move object that's shared. */
export type SuiSharedInput = {
  /** The address of the shared object. */
  address?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** The version that this object was shared at. */
  initialSharedVersion?: Maybe<Scalars["UInt53"]["output"]>;
  /**
   * Controls whether the transaction block can reference the shared object as a mutable reference or by value.
   *
   * This has implications for scheduling: Transactions that just read shared objects at a certain version (mutable = false) can be executed concurrently, while transactions that write shared objects (mutable = true) must be executed serially with respect to each other.
   */
  mutable?: Maybe<Scalars["Boolean"]["output"]>;
};

/** The structured details of a signature, varying by scheme. */
export type SuiSignatureScheme =
  | SuiEd25519Signature
  | SuiMultisigSignature
  | SuiPasskeySignature
  | SuiSecp256K1Signature
  | SuiSecp256R1Signature
  | SuiZkLoginSignature;

/** The result of simulating a transaction, including the predicted effects. */
export type SuiSimulationResult = {
  /** The predicted effects of the transaction if it were executed. */
  effects?: Maybe<SuiTransactionEffects>;
  /** The intermediate outputs for each command of the transaction simulation, including contents of mutated references and return values. */
  outputs?: Maybe<Array<SuiCommandResult>>;
};

/** Splits off coins with denominations in `amounts` from `coin`, returning multiple results (as many as there are amounts.) */
export type SuiSplitCoinsCommand = {
  /** The denominations to split off from the coin. */
  amounts: Array<SuiTransactionArgument>;
  /** The coin to split. */
  coin?: Maybe<SuiTransactionArgument>;
};

/** System transaction for storing execution time observations. */
export type SuiStoreExecutionTimeObservationsTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** Future behavior of a currency's supply. */
export enum SuiSupplyState {
  /** The supply can only decrease. */
  BurnOnly = "BURN_ONLY",
  /** The supply can neither increase nor decrease. */
  Fixed = "FIXED",
}

/** Description of a transaction, the unit of activity on Sui. */
export type SuiTransaction = SuiNode & {
  /** A 32-byte hash that uniquely identifies the transaction contents, encoded in Base58. */
  digest: Scalars["String"]["output"];
  /** The results to the chain of executing this transaction. */
  effects?: Maybe<SuiTransactionEffects>;
  /** This field is set by senders of a transaction block. It is an epoch reference that sets a deadline after which validators will no longer consider the transaction valid. By default, there is no deadline for when a transaction must execute. */
  expiration?: Maybe<SuiEpoch>;
  /** The gas input field provides information on what objects were used as gas as well as the owner of the gas object(s) and information on the gas price and budget. */
  gasInput?: Maybe<SuiGasInput>;
  /** The transaction's globally unique identifier, which can be passed to `Query.node` to refetch it. */
  id: Scalars["ID"]["output"];
  /** The type of this transaction as well as the commands and/or parameters comprising the transaction of this kind. */
  kind?: Maybe<SuiTransactionKind>;
  /** The address corresponding to the public key that signed this transaction. System transactions do not have senders. */
  sender?: Maybe<SuiAddress>;
  /** User signatures for this transaction. */
  signatures: Array<SuiUserSignature>;
  /** The Base64-encoded BCS serialization of this transaction, as a `TransactionData`. */
  transactionBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** The transaction as a JSON blob, matching the gRPC proto format (excluding BCS). */
  transactionJson?: Maybe<Scalars["JSON"]["output"]>;
};

/** An argument to a programmable transaction command. */
export type SuiTransactionArgument = SuiGasCoin | SuiInput | SuiTxResult;

export type SuiTransactionConnection = {
  /** A list of edges. */
  edges: Array<SuiTransactionEdge>;
  /** A list of nodes. */
  nodes: Array<SuiTransaction>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiTransactionEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiTransaction;
};

/** The results of executing a transaction. */
export type SuiTransactionEffects = {
  /** The effect this transaction had on the balances (sum of coin values per coin type) of addresses and objects. */
  balanceChanges?: Maybe<SuiBalanceChangeConnection>;
  /** The balance changes as a JSON array, matching the gRPC proto format. */
  balanceChangesJson?: Maybe<Scalars["JSON"]["output"]>;
  /** The checkpoint this transaction was finalized in. */
  checkpoint?: Maybe<SuiCheckpoint>;
  /** Transactions whose outputs this transaction depends upon. */
  dependencies?: Maybe<SuiTransactionConnection>;
  /**
   * A 32-byte hash that uniquely identifies the transaction contents, encoded in Base58.
   *
   * Note that this is different from the execution digest, which is the unique hash of the transaction effects.
   */
  digest: Scalars["String"]["output"];
  /** The Base64-encoded BCS serialization of these effects, as `TransactionEffects`. */
  effectsBcs?: Maybe<Scalars["Base64"]["output"]>;
  /** A 32-byte hash that uniquely identifies the effects contents, encoded in Base58. */
  effectsDigest?: Maybe<Scalars["String"]["output"]>;
  /** The effects as a JSON blob, matching the gRPC proto format (excluding BCS). */
  effectsJson?: Maybe<Scalars["JSON"]["output"]>;
  /** The epoch this transaction was finalized in. */
  epoch?: Maybe<SuiEpoch>;
  /** Events emitted by this transaction. */
  events?: Maybe<SuiEventConnection>;
  /** Rich execution error information for failed transactions. */
  executionError?: Maybe<SuiExecutionError>;
  /** Effects related to the gas object used for the transaction (costs incurred and the identity of the smashed gas object returned). */
  gasEffects?: Maybe<SuiGasEffects>;
  /** The latest version of all objects (apart from packages) that have been created or modified by this transaction, immediately following this transaction. */
  lamportVersion?: Maybe<Scalars["UInt53"]["output"]>;
  /** The before and after state of objects that were modified by this transaction. */
  objectChanges?: Maybe<SuiObjectChangeConnection>;
  /** Whether the transaction executed successfully or not. */
  status?: Maybe<SuiExecutionStatus>;
  /**
   * Timestamp corresponding to the checkpoint this transaction was finalized in.
   *
   * `null` for executed/simulated transactions that have not been included in a checkpoint.
   */
  timestamp?: Maybe<Scalars["DateTime"]["output"]>;
  /** The transaction that ran to produce these effects. */
  transaction?: Maybe<SuiTransaction>;
  /** The unchanged consensus-managed objects that were referenced by this transaction. */
  unchangedConsensusObjects?: Maybe<SuiUnchangedConsensusObjectConnection>;
};

/** The results of executing a transaction. */
export type SuiTransactionEffectsBalanceChangesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** The results of executing a transaction. */
export type SuiTransactionEffectsDependenciesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** The results of executing a transaction. */
export type SuiTransactionEffectsEventsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** The results of executing a transaction. */
export type SuiTransactionEffectsObjectChangesArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** The results of executing a transaction. */
export type SuiTransactionEffectsUnchangedConsensusObjectsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiTransactionFilter = {
  /**
   * Limit to transactions that interacted with the given address.
   * The address could be a sender, sponsor, or recipient of the transaction.
   */
  affectedAddress?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  /**
   * Limit to transactions that interacted with the given object.
   * The object could have been created, read, modified, deleted, wrapped, or unwrapped by the transaction.
   * Objects that were passed as a `Receiving` input are not considered to have been affected by a transaction unless they were actually received.
   */
  affectedObject?: InputMaybe<Scalars["SuiAddress"]["input"]>;
  /** Filter to transactions that occurred strictly after the given checkpoint. */
  afterCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Filter to transactions in the given checkpoint. */
  atCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Filter to transaction that occurred strictly before the given checkpoint. */
  beforeCheckpoint?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Filter transactions by move function called. Calls can be filtered by the `package`, `package::module`, or the `package::module::name` of their function. */
  function?: InputMaybe<Scalars["String"]["input"]>;
  /** An input filter selecting for either system or programmable transactions. */
  kind?: InputMaybe<SuiTransactionKindInput>;
  /** Limit to transactions that were sent by the given address. */
  sentAddress?: InputMaybe<Scalars["SuiAddress"]["input"]>;
};

/** Input argument to a Programmable Transaction Block (PTB) command. */
export type SuiTransactionInput =
  | SuiBalanceWithdraw
  | SuiMoveValue
  | SuiOwnedOrImmutable
  | SuiPure
  | SuiReceiving
  | SuiSharedInput;

export type SuiTransactionInputConnection = {
  /** A list of edges. */
  edges: Array<SuiTransactionInputEdge>;
  /** A list of nodes. */
  nodes: Array<SuiTransactionInput>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiTransactionInputEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiTransactionInput;
};

/** Different types of transactions that can be executed on the Sui network. */
export type SuiTransactionKind =
  | SuiAuthenticatorStateUpdateTransaction
  | SuiChangeEpochTransaction
  | SuiConsensusCommitPrologueTransaction
  | SuiEndOfEpochTransaction
  | SuiGenesisTransaction
  | SuiProgrammableSystemTransaction
  | SuiProgrammableTransaction
  | SuiRandomnessStateUpdateTransaction;

/** An input filter selecting for either system or programmable transactions. */
export enum SuiTransactionKindInput {
  /** A user submitted transaction block. */
  ProgrammableTx = "PROGRAMMABLE_TX",
  /**
   * A system transaction can be one of several types of transactions.
   * See [unions/transaction-block-kind] for more details.
   */
  SystemTx = "SYSTEM_TX",
}

/** Transfers `inputs` to `address`. All inputs must have the `store` ability (allows public transfer) and must not be previously immutable or shared. */
export type SuiTransferObjectsCommand = {
  /** The address to transfer to. */
  address?: Maybe<SuiTransactionArgument>;
  /** The objects to transfer. */
  inputs: Array<SuiTransactionArgument>;
};

/** The result of another command. */
export type SuiTxResult = {
  /** The index of the command that produced this result. */
  cmd?: Maybe<Scalars["Int"]["output"]>;
  /** For nested results, the index within the result. */
  ix?: Maybe<Scalars["Int"]["output"]>;
};

/** Information about which previous versions of a package introduced its types. */
export type SuiTypeOrigin = {
  /** The storage ID of the package that first defined this type. */
  definingId?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** Module defining the type. */
  module?: Maybe<Scalars["String"]["output"]>;
  /** Name of the struct. */
  struct?: Maybe<Scalars["String"]["output"]>;
};

/** Details pertaining to consensus-managed objects that are referenced by but not changed by a transaction. */
export type SuiUnchangedConsensusObject =
  | SuiConsensusObjectCancelled
  | SuiConsensusObjectRead
  | SuiMutateConsensusStreamEnded
  | SuiPerEpochConfig
  | SuiReadConsensusStreamEnded;

export type SuiUnchangedConsensusObjectConnection = {
  /** A list of edges. */
  edges: Array<SuiUnchangedConsensusObjectEdge>;
  /** A list of nodes. */
  nodes: Array<SuiUnchangedConsensusObject>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiUnchangedConsensusObjectEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiUnchangedConsensusObject;
};

/** Upgrades a Move Package. */
export type SuiUpgradeCommand = {
  /** ID of the package being upgraded. */
  currentPackage?: Maybe<Scalars["SuiAddress"]["output"]>;
  /** IDs of the transitive dependencies of the package to be published. */
  dependencies?: Maybe<Array<Scalars["SuiAddress"]["output"]>>;
  /** Bytecode for the modules to be published, BCS serialized and Base64 encoded. */
  modules?: Maybe<Array<Scalars["Base64"]["output"]>>;
  /** The `UpgradeTicket` authorizing the upgrade. */
  upgradeTicket?: Maybe<SuiTransactionArgument>;
};

export type SuiUserSignature = {
  /** The structured signature details, parsed by scheme. */
  scheme?: Maybe<SuiSignatureScheme>;
  /**
   * The signature bytes, Base64-encoded.
   * For simple signatures: flag || signature || pubkey
   * For complex signatures: flag || bcs_serialized_struct
   */
  signatureBytes?: Maybe<Scalars["Base64"]["output"]>;
};

export type SuiValidator = {
  /** The number of epochs for which this validator has been below the low stake threshold. */
  atRisk?: Maybe<Scalars["UInt53"]["output"]>;
  /** On-chain representation of the underlying `0x3::validator::Validator` value. */
  contents?: Maybe<SuiMoveValue>;
  /** Other validators this validator has reported. */
  reportRecords?: Maybe<SuiValidatorConnection>;
};

export type SuiValidatorReportRecordsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type SuiValidatorAggregatedSignature = {
  /** The epoch when this aggregate signature was produced. */
  epoch?: Maybe<SuiEpoch>;
  /** The Base64 encoded BLS12381 aggregated signature. */
  signature?: Maybe<Scalars["Base64"]["output"]>;
  /** The indexes of validators that contributed to this signature. */
  signersMap: Array<Scalars["Int"]["output"]>;
};

export type SuiValidatorConnection = {
  /** A list of edges. */
  edges: Array<SuiValidatorEdge>;
  /** A list of nodes. */
  nodes: Array<SuiValidator>;
  /** Information to aid in pagination. */
  pageInfo: SuiPageInfo;
};

/** An edge in a connection. */
export type SuiValidatorEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars["String"]["output"];
  /** The item at the end of the edge */
  node: SuiValidator;
};

/** Representation of `0x3::validator_set::ValidatorSet`. */
export type SuiValidatorSet = {
  /** The validators currently in the committee for this validator set. */
  activeValidators?: Maybe<SuiValidatorConnection>;
  /** On-chain representation of the underlying `0x3::validator_set::ValidatorSet` value. */
  contents?: Maybe<SuiMoveValue>;
};

/** Representation of `0x3::validator_set::ValidatorSet`. */
export type SuiValidatorSetActiveValidatorsArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  before?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Filter for paginating the history of an Object or MovePackage. */
export type SuiVersionFilter = {
  /** Filter to versions that are strictly newer than this one, defaults to fetching from the earliest version known to this RPC (this could be the initial version, or some later version if the initial version has been pruned). */
  afterVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
  /** Filter to versions that are strictly older than this one, defaults to fetching up to the latest version (inclusive). */
  beforeVersion?: InputMaybe<Scalars["UInt53"]["input"]>;
};

/** The account to withdraw funds from. */
export enum SuiWithdrawFrom {
  /** The funds are withdrawn from the transaction sender's account. */
  Sender = "SENDER",
  /** The funds are withdrawn from the sponsor's account. */
  Sponsor = "SPONSOR",
}

export type SuiWithdrawMaxAmountU64 = {
  amount?: Maybe<Scalars["BigInt"]["output"]>;
};

/** Reservation details for a withdrawal. */
export type SuiWithdrawalReservation = SuiWithdrawMaxAmountU64;

/** System transaction for writing the pre-computed storage cost for accumulator objects. */
export type SuiWriteAccumulatorStorageCostTransaction = {
  /** A workaround to define an empty variant of a GraphQL union. */
  _?: Maybe<Scalars["Boolean"]["output"]>;
};

/** A Base64-encoded claim from the JWT used in zkLogin. */
export type SuiZkLoginClaim = {
  /** The index mod 4 used for Base64 decoding alignment. */
  indexMod4?: Maybe<Scalars["Int"]["output"]>;
  /** The Base64url-unpadded encoded claim value. */
  value?: Maybe<Scalars["String"]["output"]>;
};

/** The zkLogin inputs including proof, claim details, and JWT header. */
export type SuiZkLoginInputs = {
  /** The address seed as a base10-encoded string. */
  addressSeed?: Maybe<Scalars["String"]["output"]>;
  /** The Base64-encoded JWT header. */
  headerBase64?: Maybe<Scalars["String"]["output"]>;
  /** The Base64-encoded issuer claim details. */
  issBase64Details?: Maybe<SuiZkLoginClaim>;
  /** The zero-knowledge proof points. */
  proofPoints?: Maybe<SuiZkLoginProof>;
};

/** An enum that specifies the intent scope to be used to parse the bytes for signature verification. */
export enum SuiZkLoginIntentScope {
  /** Indicates that the bytes are to be parsed as a personal message. */
  PersonalMessage = "PERSONAL_MESSAGE",
  /** Indicates that the bytes are to be parsed as transaction data bytes. */
  TransactionData = "TRANSACTION_DATA",
}

/** A JWK (JSON Web Key) identifier. */
export type SuiZkLoginJwkId = {
  /** The OIDC provider issuer string. */
  iss?: Maybe<Scalars["String"]["output"]>;
  /** The key ID that identifies the JWK. */
  kid?: Maybe<Scalars["String"]["output"]>;
};

/** The zero-knowledge proof consisting of three elliptic curve points. */
export type SuiZkLoginProof = {
  /** G1 point 'a'. */
  a?: Maybe<SuiCircomG1>;
  /** G2 point 'b'. */
  b?: Maybe<SuiCircomG2>;
  /** G1 point 'c'. */
  c?: Maybe<SuiCircomG1>;
};

/** A zkLogin public identifier, containing the OAuth issuer and address seed. */
export type SuiZkLoginPublicIdentifier = {
  /** The address seed as a decimal string. */
  addressSeed?: Maybe<Scalars["String"]["output"]>;
  /** The OAuth provider issuer string (e.g. "https://accounts.google.com"). */
  iss?: Maybe<Scalars["String"]["output"]>;
};

export type SuiZkLoginSignature = {
  /** The zkLogin inputs including proof, claim details, and JWT header. */
  inputs?: Maybe<SuiZkLoginInputs>;
  /** The JWK identifier used to verify the zkLogin proof. */
  jwkId?: Maybe<SuiZkLoginJwkId>;
  /** The maximum epoch for which this signature is valid. */
  maxEpoch?: Maybe<Scalars["UInt53"]["output"]>;
  /** The public identifier (issuer + address seed) for this zkLogin authenticator. */
  publicIdentifier?: Maybe<SuiZkLoginPublicIdentifier>;
  /** The inner user signature (ed25519/secp256k1/secp256r1). */
  signature?: Maybe<SuiSignatureScheme>;
};

/** The result of the zkLogin signature verification. */
export type SuiZkLoginVerifyResult = {
  /** Whether the signature was verified successfully. */
  success?: Maybe<Scalars["Boolean"]["output"]>;
};

export type SuiSuiMetadataSuinsQueryVariables = Exact<{
  address: Scalars["SuiAddress"]["input"];
}>;

export type SuiSuiMetadataSuinsQuery = {
  object?: { asMoveObject?: { contents?: { display?: { output?: unknown } } } };
};

export const SuiMetadataSuinsDocument = `
    query SuiMetadataSuins($address: SuiAddress!) {
  object(address: $address) {
    asMoveObject {
      contents {
        display {
          output
        }
      }
    }
  }
}
    `;

export const useSuiMetadataSuinsQuery = <
  TData = SuiSuiMetadataSuinsQuery,
  TError = unknown,
>(
  client: GraphQLClient,
  variables: SuiSuiMetadataSuinsQueryVariables,
  options?: Omit<
    UseQueryOptions<SuiSuiMetadataSuinsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      SuiSuiMetadataSuinsQuery,
      TError,
      TData
    >["queryKey"];
  },
  headers?: RequestInit["headers"],
) => {
  return useQuery<SuiSuiMetadataSuinsQuery, TError, TData>({
    queryKey: ["SuiMetadataSuins", variables],
    queryFn: fetcher<
      SuiSuiMetadataSuinsQuery,
      SuiSuiMetadataSuinsQueryVariables
    >(client, SuiMetadataSuinsDocument, variables, headers),
    ...options,
  });
};

useSuiMetadataSuinsQuery.getKey = (
  variables: SuiSuiMetadataSuinsQueryVariables,
) => ["SuiMetadataSuins", variables];

useSuiMetadataSuinsQuery.fetcher = (
  client: GraphQLClient,
  variables: SuiSuiMetadataSuinsQueryVariables,
  headers?: RequestInit["headers"],
) =>
  fetcher<SuiSuiMetadataSuinsQuery, SuiSuiMetadataSuinsQueryVariables>(
    client,
    SuiMetadataSuinsDocument,
    variables,
    headers,
  );
