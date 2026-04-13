/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from "@mysten/sui/transactions";
import {
  normalizeMoveArguments,
  type RawTransactionArgument,
} from "../utils/index.js";
export interface NewFileArguments {
  patchId: RawTransactionArgument<Array<string>>;
  mimeType: RawTransactionArgument<Array<string>>;
  sizeBytes: RawTransactionArgument<Array<number | bigint>>;
  name: RawTransactionArgument<Array<string>>;
  hash: RawTransactionArgument<Array<string>>;
}
export interface NewFileOptions {
  package?: string;
  arguments:
    | NewFileArguments
    | [
        patchId: RawTransactionArgument<Array<string>>,
        mimeType: RawTransactionArgument<Array<string>>,
        sizeBytes: RawTransactionArgument<Array<number | bigint>>,
        name: RawTransactionArgument<Array<string>>,
        hash: RawTransactionArgument<Array<string>>,
      ];
}
export function newFile(options: NewFileOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [
    "vector<0x1::string::String>",
    "vector<0x1::string::String>",
    "vector<u64>",
    "vector<0x1::string::String>",
    "vector<0x1::string::String>",
  ] satisfies (string | null)[];
  const parameterNames = ["patchId", "mimeType", "sizeBytes", "name", "hash"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "file",
      function: "new_file",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface InitFileArguments {
  artifactId: RawTransactionArgument<string>;
  files: RawTransactionArgument<string>;
}
export interface InitFileOptions {
  package?: string;
  arguments:
    | InitFileArguments
    | [
        artifactId: RawTransactionArgument<string>,
        files: RawTransactionArgument<string>,
      ];
}
export function initFile(options: InitFileOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = ["0x2::object::ID", null] satisfies (string | null)[];
  const parameterNames = ["artifactId", "files"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "file",
      function: "init_file",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface GetFileLimitOptions {
  package?: string;
  arguments?: [];
}
export function getFileLimit(options: GetFileLimitOptions = {}) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "file",
      function: "get_file_limit",
    });
}
