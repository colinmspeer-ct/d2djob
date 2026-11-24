import "server-only";
import { createTrainingLibrary } from "@/modules/training-library";
import { nodeFileStorage } from "@/modules/training-library/node-file-storage";
import { sqliteSql } from "@/modules/training-library/sqlite";
import { getDb } from "./db";
import { mediaPath } from "./paths";

export const TRAINING_SITE = "swyftinternational";

export function trainingLibrary() {
  return createTrainingLibrary(sqliteSql(getDb()), nodeFileStorage(mediaPath()), { site: TRAINING_SITE });
}
