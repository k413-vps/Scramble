import os
import json

def convert_text_files_to_json(input_folder, output_folder):
    for filename in os.listdir(input_folder):
        if filename.endswith(".txt"):
            text_filepath = os.path.join(input_folder, filename)
            json_filename = os.path.splitext(filename)[0] + ".json"
            json_filepath = os.path.join(output_folder, json_filename)

            data = {}
            try:
                with open(text_filepath, 'r', encoding='utf-8') as f:
                    for line in f:
                        stripped_line = line.strip()
                        if stripped_line:  # Only add non-empty lines
                            data[stripped_line] = True
                
                with open(json_filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=4)
                
                print(f"Converted '{filename}' to '{json_filename}'")
            except Exception as e:
                print(f"Error processing '{filename}': {e}")


input_folder_path = "txt"
output_folder_path = "json" 

if __name__ == "__main__":
    convert_text_files_to_json(input_folder_path, output_folder_path)