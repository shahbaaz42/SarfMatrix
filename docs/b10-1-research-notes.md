# B10.1 research notes

Primary in-repository references available for this phase include the Arabic morphology PDFs already committed to SarfMatrix (for example Shadha al-ʿArf, Matn al-Bināʾ, Taṣrīf al-ʿIzzī, Tashīl al-Ṣarf, Abwāb al-Ṣarf al-Jadīd, Durūs al-Taṣrīf, Kitāb al-Maqṣūd, Irshād al-Ṣarf and related exercise/reference works).

The implementation is intentionally conservative: it changes explanation-layer structural identity only and does not alter generated Arabic surfaces.

Verified grammatical distinctions implemented in this phase:

- Nūn al-niswah and heavy nūn al-tawkīd are independent components.
- When heavy emphasis follows nūn al-niswah, an alif separates the two nūns; that alif is represented independently.
- Dual: alif marks nominative, yāʾ marks accusative/genitive; nūn is a separate dual component.
- Sound masculine plural: wāw marks nominative, yāʾ marks accusative/genitive; nūn is separate.
- Feminine singular: tāʾ marbūṭah is represented independently from case/tanwīn where the generated ending exposes both.
- Feminine dual: feminine tāʾ, dual case marker and dual nūn are independent components.
- Sound feminine plural: -āt material is independent from the case marker; accusative uses kasrah, like the genitive, while nominative uses ḍammah.

Further linguistic wording in B11 should cite/check the repository PDFs directly whenever page-level access is available, and should avoid inferring grammatical identity from visible letters alone.
