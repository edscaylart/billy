import "dotenv/config";
import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@/env";
import * as schema from "./schema";
import { createId } from "@paralleldrive/cuid2";

const categories = [
  "Aluguel",
  "Condomínio",
  "Luz",
  "Água",
  "Gás",
  "Internet",
  "TV",
  "Telefone",
  "Plano de Saúde",
  "Escola",
  "Faculdade",
  "IPTU",
  "IPVA",
  "Seguro",
  "Combustível",
  "Supermercado",
  "Farmácia",
  "Vestuário",
  "Lazer",
  "Presentes",
  "Viagens",
  "Salário",
  "INSS",
  "IRPF",
  "Poupança",
  "Empréstimo",
  "Financiamento",
  "Fatura",
  "Outros",
]

const execute = async () => {
  const db = drizzle(
    new Client({
      url: env.DATABASE_URL,
    }).connection(),
    { schema }
  );

  // const data = categories.map((name) => ({
  //   id: createId(),
  //   name
  // }))

  // await db.insert(schema.categories).values(data);

  // await db.delete(schema.expenses)
}

execute()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding done!');
    process.exit(0);
  });;
