{
  description = "Keyboard Layout OSD GNOME Shell extension";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "aarch64-linux"
        "x86_64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          uuid = "keyboard-layout-osd@gruvery.systems";
        in
        {
          default = pkgs.stdenvNoCC.mkDerivation {
            pname = "keyboard-layout-osd";
            version = "3";
            src = self;

            nativeBuildInputs = [ pkgs.glib ];

            dontConfigure = true;
            dontBuild = true;

            installPhase = ''
              runHook preInstall

              extensionDir="$out/share/gnome-shell/extensions/${uuid}"
              mkdir -p "$extensionDir/schemas"

              install -Dm644 extension.js "$extensionDir/extension.js"
              install -Dm644 metadata.json "$extensionDir/metadata.json"
              install -Dm644 prefs.js "$extensionDir/prefs.js"
              install -Dm644 stylesheet.css "$extensionDir/stylesheet.css"
              install -Dm644 schemas/org.gnome.shell.extensions.layout-osd.gschema.xml \
                "$extensionDir/schemas/org.gnome.shell.extensions.layout-osd.gschema.xml"

              glib-compile-schemas "$extensionDir/schemas"

              runHook postInstall
            '';

            passthru.extensionUuid = uuid;

            meta = {
              description = "On-screen display for GNOME keyboard layout switching";
              homepage = "https://github.com/gruvery/keyboard-layout-osd";
              license = pkgs.lib.licenses.gpl3Only;
              platforms = pkgs.lib.platforms.linux;
            };
          };
        }
      );

      nixosModules.default =
        { pkgs, ... }:
        {
          environment.systemPackages = [ self.packages.${pkgs.system}.default ];
        };
    };
}
