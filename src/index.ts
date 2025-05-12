import "reflect-metadata";
import fs from "fs/promises";
import log from "loglevel";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { DataSource } from "typeorm";
import {
    SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
    SettypeEntity, CycleEntity, SetEntity,
    FormatEntity, PoolEntity, RestrictionEntity, SnapshotEntity,
    CardEntity, PrintingEntity, RulingEntity,
} from "netrunner-entities";


const OUTPUT_FILENAME = path.join("result", "standard_cards.csv");
const DATABASE_FILENAME = path.join("database", "netrunner.sqlite");
const AppDataSource = new DataSource({
    database: DATABASE_FILENAME,
    type: "better-sqlite3",
    logging: [
        "error", "warn", "info", "log",
    ],
    entities: [
        SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
        SettypeEntity, CycleEntity, SetEntity,
        FormatEntity, PoolEntity, RestrictionEntity, SnapshotEntity,
        CardEntity, PrintingEntity, RulingEntity
    ],
    prepareDatabase: db => {
        db.pragma('journal_mode = WAL');
    },
});

async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
    log.info(`SQLite database '${DATABASE_FILENAME}' connected!`);
}

async function terminate(): Promise<void> {
    await AppDataSource.destroy();
}

async function extract(): Promise<void> {
    const format_codename = "standard";
    const snapshot_entity = await AppDataSource.manager.findOne(SnapshotEntity, {
        where: {
            format_codename: format_codename,
            active: true,
        },
        relations: {
            pool: {
                sets: {
                    cycle: true,
                    printings: {
                        card: {
                            type: true,
                            subtypes: true,
                            side: true,
                            faction: true,
                        },
                    },
                },
            }
        },
        order: {
            pool: {
                sets: {
                    release_date: "ASC",
                    printings: {
                        position: "ASC",
                    }
                },
            },
        },
    });

    if(!snapshot_entity) {
        throw new Error("No active snapshot for 'Standard' format found!");
    }

    const header = [
        "NRDB编号", "循环", "卡包", "序号",
        "英文名称", "名称", "文本", "风味文字",
        "阵营", "派系", "类型", "子类型", "是否独有",
        "构筑张数限制", "推进需求", "议案分数", "基础中转",
        "牌组最小张数", "牌组影响力上限", "费用", "强度",
        "内存费用", "销毁费用", "影响力费用", "卡图作者"
    ];

    const collector = new Array<Array<string>>();
    collector.push(header);
    for(const set of snapshot_entity.pool.sets) {
        for(const printing of set.printings) {
            const subtype_names = new Array<string>();
            for(const subtype of printing.card.subtypes) {
                subtype_names.push(subtype.locale_name);
            }

            const row = [
                printing.codename, set.cycle.locale_name, set.locale_name, printing.position.toString(),
                printing.card.oracle_title, printing.card.locale_title,
                printing.card.locale_text, printing.locale_flavor,
                printing.card.side.locale_name, printing.card.faction.locale_name,
                printing.card.type.locale_name, subtype_names.join(" - "),
                (printing.card.is_unique ? "是" : ""),
                (printing.card.deck_limit == undefined ? "" : printing.card.deck_limit.toString()),
                (printing.card.advancement_requirement == undefined ? "" : printing.card.advancement_requirement.toString()),
                (printing.card.agenda_point == undefined ? "" : printing.card.agenda_point.toString()),
                (printing.card.base_link == undefined ? "" : printing.card.base_link.toString()),
                (printing.card.minimum_deck_size == undefined ? "" : printing.card.minimum_deck_size.toString()),
                (printing.card.influence_limit == undefined ? "" : printing.card.influence_limit.toString()),
                (printing.card.cost == undefined ? "" : printing.card.cost.toString()),
                (printing.card.strength == undefined ? "" : printing.card.strength.toString()),
                (printing.card.memory_cost == undefined ? "" : printing.card.memory_cost.toString()),
                (printing.card.trash_cost == undefined ? "" : printing.card.trash_cost.toString()),
                (printing.card.influence_cost == undefined ? "" : printing.card.influence_cost.toString()),
                printing.illustrator
            ];

            collector.push(row);
        }
    }


    await fs.writeFile(OUTPUT_FILENAME, stringify(collector), "utf8");
    log.info(`Table '${OUTPUT_FILENAME}' created!`);
}

async function main(): Promise<void> {
    await initialize();
    await extract();
}

main()
    .then(() => {
        log.info("Finished!");
    })
    .catch((err: Error) => {
        log.error("Failed with error: " + err.message);
        log.error("Stacktrace: " + err.stack);
    })
    .finally(async () => {
        await terminate();
    });
