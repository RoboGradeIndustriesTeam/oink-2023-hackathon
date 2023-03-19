
export enum ELevel {
    ROOT = "root",
    LEVEL_1 = "l1",
    LEVEL_2 = "l2"
}

export const Levels: Record<ELevel, string> = {
    l1: "Уровень 1",
    l2: "Уровень 2",
    root: "Суперпользователь"
}

export const levelToLI = (level: ELevel): number => {
    switch (level) {
        case ELevel.ROOT:
            return 2;
        case ELevel.LEVEL_1:
            return 1;
        case ELevel.LEVEL_2:
            return 0;
    }
}

export const levelToLA = (level: ELevel): ELevel[] => {
    switch (level) {
        case ELevel.ROOT:
            return [ELevel.LEVEL_1, ELevel.LEVEL_2, ELevel.ROOT];
        case ELevel.LEVEL_1:
            return [ELevel.LEVEL_1, ELevel.LEVEL_2];
        case ELevel.LEVEL_2:
            return [ELevel.LEVEL_2];

    }
}

