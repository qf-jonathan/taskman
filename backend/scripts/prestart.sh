#! /usr/bin/env bash

set -e
set -x

python app/pre_start.py

alembic upgrade head
