set shell := ["powershell.exe", "-c"]

default:
	just --list

dev:
	npm run dev

build:
	npm run build
