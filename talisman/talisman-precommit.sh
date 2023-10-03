#!/bin/bash

echo "Copies Talisman pre-commit hook to .git folder"
file='.git/hooks/pre-commit'

if [ ! -f $file ]
then
    echo 'No Talisman hook available. Setting up the hook now..'
    echo 'Copying Talisman pre-commit hook to your git hooks'
    curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
    chmod +x ~/install-talisman.sh

    ~/install-talisman.sh pre-commit

else
    echo 'A pre-commit hook already exists. Ensure Talisman check is also part of your pre-commit hook'
fi
