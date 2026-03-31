# File Organization Cron

## Manual Run
```bash
~/.openclaw/workspace/scripts/organize-downloads.sh
```

## Automated Schedule (add to crontab)
```bash
# Run daily at 2 AM
0 2 * * * /Users/nebulalumino/.openclaw/workspace/scripts/organize-downloads.sh >> /Users/nebulalumino/.openclaw/workspace/logs/organize.log 2>&1
```

## To Add Cron Entry
```bash
crontab -e
# Then add the line above
```

## Categories
- **Images**: jpg, jpeg, png, gif, webp, svg, heic, psd, ai, raw, bmp, tiff
- **Documents**: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, rtf, odt, ods, odp, csv, md
- **Videos**: mp4, mov, avi, mkv, wmv, flv, webm, m4v, mpg, mpeg
- **Audio**: mp3, wav, aac, flac, ogg, m4a, wma, opus
- **Archives**: zip, rar, 7z, tar, gz, bz2, xz, dmg, iso
- **Code**: py, js, ts, html, css, json, xml, yaml, yml, sh, rb, go, rs, java, c, cpp, h, swift, kt
- **Other**: everything else
