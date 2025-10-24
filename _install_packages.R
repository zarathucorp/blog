# _install_packages.R

# install required R packages (shinylive extension and dependencies)
repos <- c("https://posit-dev.r-universe.dev", getOption("repos"))
required_pkgs <- c(
  "archive",
  "curl",
  "gh",
  "httr2",
  "pkgdepends",
  "pkgcache",
  "rmarkdown",
  "shinylive"
)

message("Installing R packages: ", paste(required_pkgs, collapse = ", "))
install.packages(required_pkgs, repos = repos, dependencies = TRUE)
