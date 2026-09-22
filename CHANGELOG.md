# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.8] - 2026-09-22

### Changed
- docs: positioning — Serpex is a real-time web search API; node description, README, DOCUMENTATION and package metadata updated. Removed unverified pricing / free-tier / rate-limit numbers and fields the node doesn't have (safe search).
- `engine` deprecated (ignored by the API since 2026-06). The **Engine** field stays in Additional Fields under the same name, now free text (default `auto`) so workflows saved with any older value still load without a validation error; every value is sent as `auto`. No engine names are listed.

## [1.0.0] - 2025-01-26

### Added
- Initial release of n8n-nodes-serpex
- Support for multiple search engines:
  - Google
  - Bing
  - DuckDuckGo
  - Brave
  - Yahoo
  - Yandex
- Search operation with configurable parameters:
  - Query (required)
  - Engine selection (auto, google, bing, duckduckgo, brave, yahoo, yandex)
  - Time range filtering (all, day, week, month, year)
  - Number of results (varies)
  - Location-based results
  - Language selection
- Serpex API credentials support
- Comprehensive error handling
- Paired item support for proper data flow

### Documentation
- Complete README with installation instructions
- Detailed API documentation
- Usage examples and workflows
- Troubleshooting guide
- Publishing guide for npm

### Technical
- TypeScript implementation
- n8n workflow integration
- Proper credential handling
- Request authentication helper usage
- SVG icon for node visualization

## [Unreleased]

### Planned Features
- Additional search parameters
- Pagination support
- Batch search operations
- Response caching
- Advanced filtering options
- Image search support
- News search support

---

[1.0.0]: https://github.com/divyeshradadiya/n8n-nodes-serpex/releases/tag/v1.0.0
