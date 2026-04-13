/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from "@mysten/sui/transactions";
import {
  normalizeMoveArguments,
  type RawTransactionArgument,
} from "../utils/index.js";
export interface InitContributorArguments {
  creator: RawTransactionArgument<string>;
}
export interface InitContributorOptions {
  package?: string;
  arguments:
    | InitContributorArguments
    | [creator: RawTransactionArgument<string>];
}
export function initContributor(options: InitContributorOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = ["address"] satisfies (string | null)[];
  const parameterNames = ["creator"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "init_contributor",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface CheckRoleArguments {
  contributors: RawTransactionArgument<Array<string>>;
  role: RawTransactionArgument<number>;
}
export interface CheckRoleOptions {
  package?: string;
  arguments:
    | CheckRoleArguments
    | [
        contributors: RawTransactionArgument<Array<string>>,
        role: RawTransactionArgument<number>,
      ];
}
export function checkRole(options: CheckRoleOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = ["vector<null>", "u8"] satisfies (string | null)[];
  const parameterNames = ["contributors", "role"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "check_role",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface RemoveRoleArguments {
  contributor: RawTransactionArgument<Array<string>>;
  rootId: RawTransactionArgument<string>;
  target: RawTransactionArgument<string>;
}
export interface RemoveRoleOptions {
  package?: string;
  arguments:
    | RemoveRoleArguments
    | [
        contributor: RawTransactionArgument<Array<string>>,
        rootId: RawTransactionArgument<string>,
        target: RawTransactionArgument<string>,
      ];
}
export function removeRole(options: RemoveRoleOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [
    "vector<null>",
    "0x2::object::ID",
    "address",
  ] satisfies (string | null)[];
  const parameterNames = ["contributor", "rootId", "target"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "remove_role",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface AddRoleArguments {
  contributor: RawTransactionArgument<Array<string>>;
  rootId: RawTransactionArgument<string>;
  target: RawTransactionArgument<string>;
  role: RawTransactionArgument<number>;
}
export interface AddRoleOptions {
  package?: string;
  arguments:
    | AddRoleArguments
    | [
        contributor: RawTransactionArgument<Array<string>>,
        rootId: RawTransactionArgument<string>,
        target: RawTransactionArgument<string>,
        role: RawTransactionArgument<number>,
      ];
}
export function addRole(options: AddRoleOptions) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  const argumentsTypes = [
    "vector<null>",
    "0x2::object::ID",
    "address",
    "u8",
  ] satisfies (string | null)[];
  const parameterNames = ["contributor", "rootId", "target", "role"];
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "add_role",
      arguments: normalizeMoveArguments(
        options.arguments,
        argumentsTypes,
        parameterNames,
      ),
    });
}
export interface GetRoleAdminOptions {
  package?: string;
  arguments?: [];
}
export function getRoleAdmin(options: GetRoleAdminOptions = {}) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "get_role_admin",
    });
}
export interface GetRoleModeratorOptions {
  package?: string;
  arguments?: [];
}
export function getRoleModerator(options: GetRoleModeratorOptions = {}) {
  const packageAddress = options.package ?? "@local-pkg/walarchive";
  return (tx: Transaction) =>
    tx.moveCall({
      package: packageAddress,
      module: "contributor",
      function: "get_role_moderator",
    });
}
