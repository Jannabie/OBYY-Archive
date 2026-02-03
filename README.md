# Malie Engine Switch Tools (Dies Irae Pantheon)

A collection of Python scripts to extract, validate, and patch text scripts (`exec.dat`) for Nintendo Switch Visual Novels running on the **Malie Engine** (specifically developed for *Dies Irae Pantheon*).

This repository contains tools for safe text injection (within byte limits) and an experimental repointing tool for expanding text slots.

## 📂 Included Tools

### 1. `pantheon_patcher.py` (Stable)
The main tool for translation projects.
* **Features:** * Extracts Shift-JIS text from `exec.dat`.
  * **Smart Validation:** calculates available byte slots for each line to prevent crashes.
  * **Safe Injection:** Automatically truncates or skips lines that exceed the memory limit.
  * Supports `\n` (newline) conversion for better formatting.

### 2. `pantheon_repointer.py` (Experimental / PoC)
A Proof-of-Concept tool attempting to implement "Masagrator-style" repointing (moving text to the end of the file to bypass length limits).
* **Function:** Scans for Little Endian pointers pointing to a specific text offset and redirects them to a new address at the EOF (End of File).
* **Status:** Experimental. 
* **Note:** It may fail on games with hardcoded immediate values (like *Dies Irae Pantheon*), but the logic is valid for other Malie games using standard pointer tables.

## 🚀 How to Use

### Prerequisites
* Python 3.x
* A dump of the game script (`exec.dat`)

### Workflow (Stable Patcher)

1.  **Extract Text:**
    ```bash
    python pantheon_patcher.py
    # Select Option 1 (Extract)
    ```
    This generates `dump.txt`.

2.  **Translate:**
    Edit `dump.txt`. 
    * Format: `OFFSET|||Translated Text`
    * **Crucial:** Pay attention to the `# [INFO] LIMIT` comment above each line. Your text (Shift-JIS encoded) must not exceed this byte limit.
    * Use `\n` for line breaks.

3.  **Validate:**
    ```bash
    python pantheon_patcher.py
    # Select Option 2 (Validate)
    ```
    Ensure all checks are [GREEN]. If [RED], shorten your sentences.

4.  **Patch:**
    ```bash
    python pantheon_patcher.py
    # Select Option 3 (Insert)
    ```
    This creates `exec_patched.dat`. Rename it to `exec.dat` and test.

## ⚠️ Known Limitations (Dies Irae Pantheon)

* **Byte Limit:** The Switch version of *Dies Irae Pantheon* uses Shift-JIS encoding. Unlike the PC version (UTF-16), the text slots in `exec.dat` are tightly packed.
* **Hardcoded Pointers:** The experimental repointer (`pantheon_repointer.py`) fails on this specific game because the game logic does not use a standard pointer table for dialogue text. The addresses are likely hardcoded in the executable (`exefs`) or calculated at runtime.
* **Word Wrap:** The engine does not support auto-word-wrap for ASCII characters properly. Manual `\n` insertion is recommended.

## 📝 License

This project is open-source. Feel free to fork and modify.
Credits to the *Dies Irae* modding community and Masagrator for the initial research on Switch limitations.

**Disclaimer:** This tool is for educational and translation purposes only.
