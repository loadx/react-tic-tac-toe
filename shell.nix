{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let
  node = pkgs.nodejs-13_x;
  yarn = pkgs.yarn.override { nodejs = node; };
in

mkShell {
  buildInputs = [ node yarn ];
}

