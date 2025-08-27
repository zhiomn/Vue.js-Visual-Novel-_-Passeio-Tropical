import os
from PIL import Image

# --- Configuration ---
# 1. Folder with your original images
input_folder = "images/backgrounds" 

# 2. Folder where thumbnails will be saved
output_folder = "thumbnails"

# 3. >>> NEW: Set the target height for all thumbnails.
#    The width will be calculated automatically to keep the original proportions.
max_height = 1080 

# 4. List of file extensions to look for
allowed_extensions = (".webp", ".jpeg", ".jpg", ".png") # Added .png for more flexibility
# ---------------------


# Ensure the output folder exists
os.makedirs(output_folder, exist_ok=True)

print(f"Searching for {', '.join(allowed_extensions)} images in '{input_folder}'...")

if not os.path.isdir(input_folder):
    print(f"!! Error: Input folder '{input_folder}' not found. Please check the path.")
else:
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(allowed_extensions):
            input_path = os.path.join(input_folder, filename)
            
            base_filename = os.path.splitext(filename)[0]
            output_filename = f"{base_filename}.webp"
            output_path = os.path.join(output_folder, output_filename)
            
            try:
                with Image.open(input_path) as img:
                    # --- CORE LOGIC CHANGE ---
                    # Calculate the new width based on the max_height
                    orig_width, orig_height = img.size
                    
                    # Prevent division by zero for corrupted files
                    if orig_height > 0:
                        aspect_ratio = orig_width / orig_height
                        new_width = int(aspect_ratio * max_height)
                        new_size = (new_width, max_height)
                        
                        # Convert images with palettes or transparency to RGBA for consistency
                        if img.mode in ("P", "LA"):
                            img = img.convert("RGBA")

                        # Resize the image proportionally
                        thumbnail = img.resize(new_size, Image.Resampling.LANCZOS)
                        
                        # Save the new thumbnail in WEBP format
                        thumbnail.save(output_path, "WEBP")
                        
                        print(f"  -> Resized {filename} to {new_width}x{max_height} -> {output_filename}")
                    else:
                        print(f"  !! Skipped {filename} due to invalid height.")

            except Exception as e:
                print(f"  !! Failed to process {filename}: {e}")

    print("\nThumbnail generation complete!")
    print(f"Your new thumbnails are in the '{output_folder}' folder.")
