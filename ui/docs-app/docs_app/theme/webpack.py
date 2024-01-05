from invenio_assets.webpack import WebpackThemeBundle

theme = WebpackThemeBundle(
    __name__,
    "assets",
    default="semantic-ui",
    themes={
        "semantic-ui": dict(
            entry={
                "docs_app_search": "./js/docs_app/search/index.js",
                "docs_app_components": "./js/docs_app/custom-components.js",
                "docs_app_deposit_form": "./js/docs_app/forms/deposit/index.js",
            },
            dependencies={
                "react-searchkit": "^2.0.0",
                "react-dnd-test-backend": "^16.0.1",
                "@oarepo/file-manager": "^1.0.9",
                "preact": "^10.5.13",
            },
            devDependencies={},
            aliases={
                "@translations/docs_app": "translations/nr_docs",
                # "@translations/docs_app": "translations/docs_app",
            },
        )
    },
)
