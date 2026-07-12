import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

type StorageBackup = {
  version: 1;
  app: "growth-journal";
  exportedAt: string;
  storage: Record<string, string>;
};

const LAST_BACKUP_KEY =
  "planner-last-backup-at";

function getStorageEntries(): Record<
  string,
  string
> {
  const entries: Record<string, string> = {};

  for (
    let index = 0;
    index < localStorage.length;
    index += 1
  ) {
    const key = localStorage.key(index);

    if (!key) {
      continue;
    }

    const value = localStorage.getItem(key);

    if (value !== null) {
      entries[key] = value;
    }
  }

  return entries;
}

function downloadFile(
  filename: string,
  content: string,
  mimeType: string
) {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function createFileDate(): string {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  const hours = String(
    now.getHours()
  ).padStart(2, "0");

  const minutes = String(
    now.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}`;
}

function formatStorageValue(
  value: string
): string {
  try {
    const parsedValue: unknown =
      JSON.parse(value);

    return JSON.stringify(
      parsedValue,
      null,
      2
    );
  } catch {
    return value;
  }
}

function getFriendlyKeyName(
  key: string
): string {
  const normalizedKey =
    key.toLowerCase();

  if (
    normalizedKey.includes("reflection")
  ) {
    return "Рефлексии";
  }

  if (
    normalizedKey.includes("task")
  ) {
    return "Задачи и подзадачи";
  }

  if (
    normalizedKey.includes("project")
  ) {
    return "Проекты";
  }

  if (
    normalizedKey.includes("topic")
  ) {
    return "Темы";
  }

  if (
    normalizedKey.includes("theme")
  ) {
    return "Оформление";
  }

  return key;
}

function createReadableText(
  storage: Record<string, string>
): string {
  const sections = Object.entries(storage)
    .filter(
      ([key]) =>
        key !== LAST_BACKUP_KEY
    )
    .map(([key, value]) => {
      const title =
        getFriendlyKeyName(key);

      const formattedValue =
        formatStorageValue(value);

      return [
        "========================================",
        title,
        `Ключ: ${key}`,
        "========================================",
        formattedValue,
        "",
      ].join("\n");
    });

  return [
    "РЕЗЕРВНАЯ КОПИЯ ПЛАНИРОВЩИКА",
    "",
    `Создана: ${new Date().toLocaleString(
      "ru-RU"
    )}`,
    "",
    ...sections,
  ].join("\n");
}

function isStorageBackup(
  value: unknown
): value is StorageBackup {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const backup =
    value as Partial<StorageBackup>;

  if (
    backup.version !== 1 ||
    backup.app !== "growth-journal" ||
    typeof backup.exportedAt !==
      "string" ||
    !backup.storage ||
    typeof backup.storage !==
      "object" ||
    Array.isArray(backup.storage)
  ) {
    return false;
  }

  return Object.values(
    backup.storage
  ).every(
    (storageValue) =>
      typeof storageValue === "string"
  );
}

export default function BackupPanel() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [lastBackupAt, setLastBackupAt] =
    useState<string | null>(() =>
      localStorage.getItem(
        LAST_BACKUP_KEY
      )
    );

  function saveBackupTimestamp() {
    const timestamp =
      new Date().toISOString();

    localStorage.setItem(
      LAST_BACKUP_KEY,
      timestamp
    );

    setLastBackupAt(timestamp);
  }

  function exportJsonBackup() {
    try {
      const storage =
        getStorageEntries();

      const backup: StorageBackup = {
        version: 1,
        app: "growth-journal",
        exportedAt:
          new Date().toISOString(),
        storage,
      };

      downloadFile(
        `growth-journal-backup-${createFileDate()}.json`,
        JSON.stringify(
          backup,
          null,
          2
        ),
        "application/json;charset=utf-8"
      );

      saveBackupTimestamp();
    } catch (error) {
      console.error(
        "Ошибка создания резервной копии:",
        error
      );

      window.alert(
        "Не удалось создать резервную копию."
      );
    }
  }

  function exportTextBackup() {
    try {
      const storage =
        getStorageEntries();

      const readableText =
        createReadableText(storage);

      downloadFile(
        `growth-journal-${createFileDate()}.txt`,
        readableText,
        "text/plain;charset=utf-8"
      );

      saveBackupTimestamp();
    } catch (error) {
      console.error(
        "Ошибка создания текстового файла:",
        error
      );

      window.alert(
        "Не удалось создать текстовый файл."
      );
    }
  }

  function openImportDialog() {
    fileInputRef.current?.click();
  }

  async function handleImport(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const fileContent =
        await file.text();

      const parsedBackup: unknown =
        JSON.parse(fileContent);

      if (
        !isStorageBackup(parsedBackup)
      ) {
        window.alert(
          "Файл не похож на резервную копию Growth Journal."
        );

        return;
      }

      const confirmed = window.confirm(
        "Восстановить данные из резервной копии? Текущие данные с такими же ключами будут заменены."
      );

      if (!confirmed) {
        return;
      }

      Object.entries(
        parsedBackup.storage
      ).forEach(([key, value]) => {
        localStorage.setItem(
          key,
          value
        );
      });

      window.alert(
        "Данные восстановлены. Планировщик будет перезагружен."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Ошибка восстановления:",
        error
      );

      window.alert(
        "Не удалось прочитать резервную копию. Проверь файл."
      );
    }
  }

  const formattedLastBackup =
    lastBackupAt
      ? new Date(
          lastBackupAt
        ).toLocaleString("ru-RU")
      : "Копий ещё не было";

  return (
    <section
      className="
        mb-8
        rounded-3xl
        border
        border-pink-100
        bg-white/65
        p-4
        shadow-lg
        backdrop-blur-md
        sm:p-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            💾 Резервная копия
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Сохрани задачи, проекты,
            рефлексии и настройки на
            компьютер
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Последнее сохранение:{" "}
            {formattedLastBackup}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportJsonBackup}
            className="
              rounded-xl
              bg-pink-500
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-pink-600
              active:scale-95
            "
          >
            Скачать копию
          </button>

          <button
            type="button"
            onClick={exportTextBackup}
            className="
              rounded-xl
              border
              border-pink-200
              bg-white/80
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-600
              transition
              hover:bg-pink-50
              active:scale-95
            "
          >
            Скачать для Блокнота
          </button>

          <button
            type="button"
            onClick={openImportDialog}
            className="
              rounded-xl
              border
              border-violet-200
              bg-white/80
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-600
              transition
              hover:bg-violet-50
              active:scale-95
            "
          >
            Восстановить
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div
        className="
          mt-4
          rounded-2xl
          bg-white/60
          px-4
          py-3
          text-xs
          leading-5
          text-gray-500
        "
      >
        Файл JSON нужен для полного
        восстановления. Файл TXT можно
        открыть в обычном Блокноте, но он
        предназначен только для чтения.
      </div>
    </section>
  );
}