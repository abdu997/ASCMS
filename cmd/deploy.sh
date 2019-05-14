cd public_html/thaw.intra.sandbox
git checkout thaw.intra.sandbox
git pull
cd php/CRON
php compile.php
cd ../../docroot
npm install
npm run build
