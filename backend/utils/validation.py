import os
import pandas as pd

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def validate_csv_file(file, max_bytes=100*1024*1024):
    if not file or file.filename == '':
        return False, "No file provided or empty filename."
    
    if not allowed_file(file.filename, {'csv'}):
        return False, "Invalid file format. Only CSV files are allowed."
    
    # Check size if available
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    
    if size > max_bytes:
        return False, f"File size exceeds {max_bytes / (1024*1024):.0f}MB limit."
    
    return True, None

def validate_dataframe_features(df, required_features):
    df_cols = [c.strip() for c in df.columns]
    missing = [f for f in required_features if f not in df_cols]
    if missing:
        return False, missing
    return True, []
