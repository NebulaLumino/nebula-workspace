#!/bin/sh
# File Organization Script
# Organizes files in a directory by extension
# POSIX-compatible version

TARGET_DIR="${1:-$HOME/Downloads}"

# Define categories and their extensions (pipe-separated)
CATEGORIES="Images:jpg,jpeg,png,gif,webp,svg,heic,heif,psd,ai,raw,bmp,tiff|Documents:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf,odt,ods,odp,csv,md|Videos:mp4,mov,avi,mkv,wmv,flv,webm,m4v,mpg,mpeg|Audio:mp3,wav,aac,flac,ogg,m4a,wma,opus|Archives:zip,rar,7z,tar,gz,bz2,xz,dmg,iso|Code:py,js,ts,html,css,json,xml,yaml,yml,sh,rb,go,rs,java,c,cpp,h,swift,kt"

# Create category directories
echo "$CATEGORIES" | tr '|' '\n' | cut -d: -f1 | while read -r category; do
    mkdir -p "$TARGET_DIR/$category"
done
mkdir -p "$TARGET_DIR/Other"

# Function to get category for a file
get_category() {
    ext="$1"
    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
    
    # Check each category
    echo "$CATEGORIES" | tr '|' '\n' | while read -r line; do
        category=$(echo "$line" | cut -d: -f1)
        exts=$(echo "$line" | cut -d: -f2)
        
        # Check if extension matches
        case ",$exts," in
            *",$ext,"*) echo "$category"; return ;;
        esac
    done
    echo "Other"
}

# Counters
moved=0
skipped=0

# Process files in target directory
for file in "$TARGET_DIR"/*; do
    # Skip if not a file
    [ -f "$file" ] || continue
    
    # Get filename
    filename=$(basename "$file")
    
    # Skip hidden files and organization directories
    case "$filename" in .*) continue ;; esac
    case "$filename" in Images|Documents|Videos|Audio|Archives|Code|Other) continue ;; esac
    
    # Get extension
    ext="${filename##*.}"
    
    # Skip if no extension
    if [ "$ext" = "$filename" ]; then
        mv "$file" "$TARGET_DIR/Other/" 2>/dev/null || true
        moved=$((moved + 1))
        continue
    fi
    
    # Skip .DS_Store and similar
    case "$filename" in .DS_Store|.localized) continue ;; esac
    
    # Get category
    category=$(get_category "$ext")
    
    # Move file if not already in correct directory
    current_dir=$(dirname "$file")
    if [ "$current_dir" != "$TARGET_DIR/$category" ]; then
        mv "$file" "$TARGET_DIR/$category/" 2>/dev/null || true
        moved=$((moved + 1))
    else
        skipped=$((skipped + 1))
    fi
done

echo "Organization complete: $moved files moved, $skipped files skipped"