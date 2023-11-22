# Fix Cloudflare 308 trailing comma redrect issue
# https://community.cloudflare.com/t/cloudflare-pages-get-rid-of-redundat-308-redirect/324582/29
# https://electricui.com/blog/switching-to-cloudflare-pages#how-to-disable-the-trailing-slash-on-cloudflare-pages

find ./dist -name 'index.html' -mindepth 2 -type f \
  -exec sh \
  -c 'parent="$(dirname "$1")"; mv "$1" "$parent/../$(basename "$parent").html";' \
  find-sh {} \;

find ./dist -empty -type d -delete
