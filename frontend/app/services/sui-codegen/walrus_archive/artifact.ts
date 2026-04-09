/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from "@mysten/sui/transactions";
import {
  normalizeMoveArguments,
  type RawTransactionArgument,
} from "../utils/index.js";
export interface InitArtifactArguments {
  metadata: RawTransactionArgument<string>;
  files: RawTransactionArgument<string>;
}
export interface InitArtifactOptions {
  package?: string;
  arguments:
    | InitArtifactArguments
    | [
        metadata: RawTransactionArgument<string>,
        files: RawTransactionArgument<string>,
      ];
}
export function initArtifact(options: InitArtifactOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [null, null] satisfies (string | null)[];
  const parameterNames = ["metadata", "files"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "artifact",
      function: "init_artifact",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface CommitArtifactWithoutParentArguments {
  root: RawTransactionArgument<string>;
  metadata: RawTransactionArgument<string>;
  files: RawTransactionArgument<string>;
}
export interface CommitArtifactWithoutParentOptions {
  package?: string;
  arguments:
    | CommitArtifactWithoutParentArguments
    | [
        root: RawTransactionArgument<string>,
        metadata: RawTransactionArgument<string>,
        files: RawTransactionArgument<string>,
      ];
}
export function commitArtifactWithoutParent(
  options: CommitArtifactWithoutParentOptions,
) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [null, null, null] satisfies (string | null)[];
  const parameterNames = ["root", "metadata", "files"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "artifact",
      function: "commit_artifact_without_parent",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface CommitArtifactWithParentArguments {
  root: RawTransactionArgument<string>;
  parent: RawTransactionArgument<string>;
  metadata: RawTransactionArgument<string>;
  files: RawTransactionArgument<string>;
}
export interface CommitArtifactWithParentOptions {
  package?: string;
  arguments:
    | CommitArtifactWithParentArguments
    | [
        root: RawTransactionArgument<string>,
        parent: RawTransactionArgument<string>,
        metadata: RawTransactionArgument<string>,
        files: RawTransactionArgument<string>,
      ];
}
export function commitArtifactWithParent(
  options: CommitArtifactWithParentOptions,
) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [null, null, null, null] satisfies (string | null)[];
  const parameterNames = ["root", "parent", "metadata", "files"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "artifact",
      function: "commit_artifact_with_parent",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface ManagementRoleArguments {
  artifact: RawTransactionArgument<string>;
  target: RawTransactionArgument<string>;
  role: RawTransactionArgument<number | null>;
}
export interface ManagementRoleOptions {
  package?: string;
  arguments:
    | ManagementRoleArguments
    | [
        artifact: RawTransactionArgument<string>,
        target: RawTransactionArgument<string>,
        role: RawTransactionArgument<number | null>,
      ];
}
export function managementRole(options: ManagementRoleOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [
    null,
    "address",
    "0x1::option::Option<u8>",
  ] satisfies (string | null)[];
  const parameterNames = ["artifact", "target", "role"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "artifact",
      function: "management_role",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
