import sys
import os

# === KONFIGURASI ===
FILENAME = "exec.dat"
OUTPUT_TXT = "dump_final_test.txt"
NEW_FILENAME = "exec_patched.dat"
ENCODING = "cp932"  # Shift-JIS
MIN_LENGTH = 5 

def is_valid_shiftjis(byte_data):
    try:
        text = byte_data.decode(ENCODING)
        valid_chars = 0
        for char in text:
            if ord(char) > 0x80 or (0x20 <= ord(char) <= 0x7E):
                valid_chars += 1
        return valid_chars >= len(text) * 0.7
    except:
        return False

def extract_text():
    if not os.path.exists(FILENAME):
        print(f"[ERROR] {FILENAME} tidak ditemukan!")
        return

    with open(FILENAME, "rb") as f:
        data = f.read()

    extracted = []
    i = 0
    total_len = len(data)
    count = 0
    
    print("[*] Mengekstrak teks & menghitung kapasitas slot...")
    
    while i < total_len:
        if data[i] != 0:
            start_pos = i
            temp_bytes = bytearray()
            while i < total_len and data[i] != 0:
                temp_bytes.append(data[i])
                i += 1
            
            # Hitung Padding (Ruang kosong setelah teks) buat nambah jatah
            padding_count = 0
            peek_i = i
            while peek_i < total_len and data[peek_i] == 0:
                padding_count += 1
                peek_i += 1
            
            # Total Jatah Byte Kamu
            max_capacity = len(temp_bytes) + padding_count - 1

            if len(temp_bytes) >= MIN_LENGTH and is_valid_shiftjis(temp_bytes):
                try:
                    text = temp_bytes.decode(ENCODING)
                    text_display = text.replace('\n', '\\n').replace('\r', '\\r')
                    extracted.append(f"# [INFO] BATAS: {max_capacity} Bytes (Huruf)")
                    extracted.append(f"{start_pos}|||{text_display}")
                    count += 1
                except:
                    pass
        else:
            i += 1

    with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
        f.write("# FORMAT: OFFSET|||TEKS\n")
        f.write("# PENTING: Perhatikan '# [INFO] BATAS' di atas setiap baris.\n")
        f.write("# Kalau teksmu melebihi batas itu, GAME AKAN CRASH.\n")
        for line in extracted:
            f.write(line + "\n")
            
    print(f"[SUKSES] {count} baris diekstrak ke {OUTPUT_TXT}")

def validate_text():
    print(f"[*] Memeriksa panjang kalimat di {OUTPUT_TXT}...")
    if not os.path.exists(OUTPUT_TXT): return

    with open(FILENAME, "rb") as f: data_orig = f.read()
    with open(OUTPUT_TXT, "r", encoding="utf-8") as f: lines = f.readlines()

    error_count = 0
    print("\n--- HASIL VALIDASI ---")
    
    for line in lines:
        if "|||" not in line or line.startswith("#"): continue
        
        parts = line.strip().split("|||", 1)
        offset = int(parts[0])
        new_text_raw = parts[1]
        
        new_text_processed = new_text_raw.replace('\\n', '\n').replace('\\r', '\r')

        # Hitung kapasitas asli
        curr = offset
        orig_len = 0
        while curr < len(data_orig) and data_orig[curr] != 0: orig_len += 1; curr += 1
        pad_len = 0
        curr = offset + orig_len
        while curr < len(data_orig) and data_orig[curr] == 0: pad_len += 1; curr += 1
        max_limit = orig_len + pad_len - 1
        
        try:
            new_bytes = new_text_processed.encode(ENCODING)
            len_new = len(new_bytes)
        except:
            print(f"[ERROR] Offset {offset}: Ada karakter tidak support!")
            error_count += 1
            continue

        if len_new > max_limit:
            print(f"[MERAH/KEPANJANGAN] Offset {offset}")
            print(f"   Teks: {new_text_raw}")
            print(f"   Pakai: {len_new} | Batas: {max_limit}")
            print(f"   -> WAJIB POTONG {len_new - max_limit} HURUF!")
            error_count += 1
    
    if error_count == 0:
        print("\n[HIJAU] SEMUA AMAN! Gas ke Menu Insert.")
    else:
        print(f"\n[MERAH] Ada {error_count} error. JANGAN DI-INSERT DULU.")

def insert_text():
    print("[*] Mulai patching...")
    with open(FILENAME, "rb") as f: data = bytearray(f.read())
    with open(OUTPUT_TXT, "r", encoding="utf-8") as f: lines = f.readlines()

    patched = 0
    skipped = 0
    
    for line in lines:
        if "|||" not in line or line.startswith("#"): continue
        parts = line.strip().split("|||", 1)
        offset = int(parts[0])
        new_text_raw = parts[1]
        
        new_text_processed = new_text_raw.replace('\\n', '\n').replace('\\r', '\r')

        try:
            new_bytes = new_text_processed.encode(ENCODING)
        except: continue

        # Hitung ulang limit
        curr = offset
        orig_len = 0
        while curr < len(data) and data[curr] != 0: orig_len += 1; curr += 1
        curr = offset + orig_len
        pad_len = 0
        while curr < len(data) and data[curr] == 0: pad_len += 1; curr += 1
        max_limit = orig_len + pad_len - 1

        if len(new_bytes) > max_limit:
            skipped += 1
            continue # Skip demi keamanan

        # Write
        for k in range(len(new_bytes)): data[offset + k] = new_bytes[k]
        data[offset + len(new_bytes)] = 0x00 
        
        # Clean sisa
        clean_limit = offset + orig_len + pad_len
        for k in range(offset + len(new_bytes) + 1, clean_limit):
            if k < len(data): data[k] = 0x00
            
        patched += 1

    print(f"[*] Menyimpan ke {NEW_FILENAME}...")
    with open(NEW_FILENAME, "wb") as f: f.write(data)
    print(f"[SELESAI] Sukses: {patched}, Dilewati (Bahaya): {skipped}")

if __name__ == "__main__":
    print("=== PANTHEON FINAL: VALIDASI & TEST ===")
    print("1. Extract")
    print("2. Validasi (WAJIB CEK)")
    print("3. Insert")
    c = input("Pilih: ")
    if c == "1": extract_text()
    elif c == "2": validate_text()
    elif c == "3": insert_text()