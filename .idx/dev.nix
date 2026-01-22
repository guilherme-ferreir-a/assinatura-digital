{ pkgs, ... }: {
  # Specifies the Nixpkgs channel to use.
  # This determines which package versions are available.
  channel = "stable-24.05";

  # A list of packages to install from the specified channel.
  packages = [
    pkgs.nodejs_20
    pkgs.bun # Added bun for dependency management
    pkgs.gh
  ];

  # Configuration for VS Code extensions and workspace settings.
  idx = {
    # A list of VS Code extensions to install from the Open VSX Registry.
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
    ];

    # Workspace lifecycle hooks.
    workspace = {
      # Runs when a workspace is first created.
      onCreate = {
        npm-install = "npm install";
      };
      # Runs every time the workspace is (re)started.
      onStart = {
        dev-server = "npm run dev";
      };
    };

    # Configure a web preview for your application.
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
