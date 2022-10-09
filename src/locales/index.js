// Only one item MUST have the "default: true" key

module.exports = {
  en: {
    default: true,
    path: 'en',
    locale: 'en',
    dateFormat: 'DD/MM/YYYY',
    siteLanguage: 'en',
    ogLanguage: 'en',
    defaultTitle: 'Using i18n with Gatsby',
    defaultDescription: 'Gatsby example site using MDX and dependency-free i18n'
  },
  de: {
    path: 'ar',
    locale: 'ar',
    dateFormat: 'DD/MM/YYYY',
    siteLanguage: 'ar',
    ogLanguage: 'ar',
    defaultTitle: 'i18n mit Gatsby nutzen',
    defaultDescription: 'Gatsby Beispielseite, die MDX und i18n (frei von dependencies) nutzt'
  }
}
