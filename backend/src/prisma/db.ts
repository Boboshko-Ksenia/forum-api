import "dotenv/config";

import postgres, { type PostgresClient } from "@prisma/orm-postgres/runtime";

import contractFromJson from "@prisma/orm-postgres/static";

import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

export type Database = PostgresClient<Contract>;

const contract = contractFromJson<Contract>({ contractJson });

export function createDb(url: string): Database {
	return postgres({
		contractJson,
		url,
	});
}