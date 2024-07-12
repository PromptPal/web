# Changelog

## [1.10.1](https://github.com/PromptPal/web/compare/v1.10.0...v1.10.1) (2024-07-12)


### Bug Fixes

* **ci:** update lint command ([df6d0b4](https://github.com/PromptPal/web/commit/df6d0b41acec6c94d2e998c1053104ea2885b61d))
* **deps:** update deps ([7073e58](https://github.com/PromptPal/web/commit/7073e58df6885dad85e7fa70986eb08a608d6a64))
* **prompt:** fix visual errors ([2e0cb59](https://github.com/PromptPal/web/commit/2e0cb59f0e2e1ed32e38b99c5efe317b4faea850))

## [1.10.0](https://github.com/PromptPal/web/compare/v1.9.3...v1.10.0) (2024-07-05)


### Features

* **pages:** support more types in prompt ([f633ed9](https://github.com/PromptPal/web/commit/f633ed98b693ae7cc204f9aa5970fc0e691e7ffe))
* **prompt:** add support for multiple type of variable in prompt ([3675ba6](https://github.com/PromptPal/web/commit/3675ba67823c3a1f8890242573edb39ffe502833))


### Bug Fixes

* **http:** increase default timeout to 10 mins ([624b779](https://github.com/PromptPal/web/commit/624b779b2f96cdf76bfadd4dfdc85cc25a3077a0))
* **project:** ignore gemini token incorrect assignment when update ([80ee678](https://github.com/PromptPal/web/commit/80ee67830382efe837eeacb08451eae29b5803ca))

## [1.9.3](https://github.com/PromptPal/web/compare/v1.9.2...v1.9.3) (2024-05-14)


### Bug Fixes

* **gpt4o:** enable gpt-4o ([b49deea](https://github.com/PromptPal/web/commit/b49deea1947e2255e9c62d4e980db92b71181286))

## [1.9.2](https://github.com/PromptPal/web/compare/v1.9.1...v1.9.2) (2024-05-13)


### Bug Fixes

* **ci:** fix version in ci ([9a1b7af](https://github.com/PromptPal/web/commit/9a1b7af08d2ee8f71efc607177606ab6990afadb))

## [1.9.1](https://github.com/PromptPal/web/compare/v1.9.0...v1.9.1) (2024-05-13)


### Bug Fixes

* **ci:** fix package manager ([8028a3e](https://github.com/PromptPal/web/commit/8028a3e27c63d32c5f7818f509b52d20bae3474d))

## [1.9.0](https://github.com/PromptPal/web/compare/v1.8.0...v1.9.0) (2024-05-09)


### Features

* **calls:** add costs support on each prompt ([3522b27](https://github.com/PromptPal/web/commit/3522b272be40cb018e871e8c9fa0c112c83ea7c7))
* **calls:** add userAgent info in prompt call ([01d9e45](https://github.com/PromptPal/web/commit/01d9e452a4cae86c8ee4da13d8bdff45297ae603))
* **ci:** add githook for check code quality ([c2e0a12](https://github.com/PromptPal/web/commit/c2e0a121b0681e5b7ac6c512d47aac482d5967b1))
* **ci:** upgrade to node 22 ([145b8ef](https://github.com/PromptPal/web/commit/145b8ef8ac9ab125df0eb188f06f9014ecad23fa))
* **lint:** move lint from eslint to biome ([884ae09](https://github.com/PromptPal/web/commit/884ae0967f1c432be5cb711fa3caee9476c005c6))


### Bug Fixes

* **calls:** fix costs to cents ([27be701](https://github.com/PromptPal/web/commit/27be7014c53cf42821a0114a1d56269be190ce18))
* **history:** show empty info if there are no history ([bc6a3ce](https://github.com/PromptPal/web/commit/bc6a3ce65b684bfd49f5f4bb89a40865046559ee))

## [1.8.0](https://github.com/PromptPal/web/compare/v1.7.3...v1.8.0) (2024-04-30)


### Features

* **prompt:** add history modal ([091c217](https://github.com/PromptPal/web/commit/091c217a3cb9a5a86ca0059778df6f96eca4e8d6))
* Update PromptHistoriesPage with PromptDiffView component ([4af7414](https://github.com/PromptPal/web/commit/4af74142a2c0edb6187e4ab0e108c2e37cca39f0))

## [1.7.3](https://github.com/PromptPal/web/compare/v1.7.2...v1.7.3) (2024-04-13)


### Bug Fixes

* **ui:** fix ui issues ([c6d542d](https://github.com/PromptPal/web/commit/c6d542d499d23abfd6e691d009c0f1953b1be762))

## [1.7.2](https://github.com/PromptPal/web/compare/v1.7.1...v1.7.2) (2024-04-10)


### Features

* **tests:** setup tests ([9c8c491](https://github.com/PromptPal/web/commit/9c8c491a966336ca697c6720bd4f1927d7484e03))


### Bug Fixes

* **deps:** upgrade deps to latest ([3d0ac14](https://github.com/PromptPal/web/commit/3d0ac146e5393e3517e17f67a6df630674a0dfc2))
* **models:** add gpt4-turbo to supported models ([7476451](https://github.com/PromptPal/web/commit/74764516493be5f217f9fd4a270c42e58d16dc30))


### Miscellaneous Chores

* change release number to 1.7.2 ([6e62be7](https://github.com/PromptPal/web/commit/6e62be786ebb79f0c7c58757b0c5351ec391825d))

## [1.7.1](https://github.com/PromptPal/web/compare/v1.7.0...v1.7.1) (2024-03-11)


### Bug Fixes

* **auth:** redirect to auth page if unauthorized ([80f0c25](https://github.com/PromptPal/web/commit/80f0c25c09d1741125c8e61133c0d7654bcbd591))

## [1.7.0](https://github.com/PromptPal/web/compare/v1.6.0...v1.7.0) (2024-03-10)


### Features

* **charts:** replace charts to mantine/charts ([2e43de1](https://github.com/PromptPal/web/commit/2e43de1da33aa2203f7d195368c7608f1189c4bb))
* **metrics:** add project and prompt metric ([ec9d751](https://github.com/PromptPal/web/commit/ec9d751e2c27b8166ec0676f32871bc65b208241))
* **sso:** add sso support ([b08678b](https://github.com/PromptPal/web/commit/b08678bec449b107ce4ba74ecf9e6a5b62c90927))


### Bug Fixes

* **auth:** add base layout of callback page ([f9b4bb7](https://github.com/PromptPal/web/commit/f9b4bb7a56cf2d532ba0778774ae441446e68381))
* **project:** add support for dynamic rendering of form fields based on selected model ([be58d17](https://github.com/PromptPal/web/commit/be58d17136599e4896a0afe4e47f3d1ffca7c961))
* **project:** fix issues because of project upgrading ([4f90ecc](https://github.com/PromptPal/web/commit/4f90ecc3d77853fa473242a56a4fd6488a9a6e31))
* **prompt:** add help docs in prompt page ([4101a72](https://github.com/PromptPal/web/commit/4101a72e46010dfcc9ef112afb83ead53d928591))
* **prompt:** fix prompt response preview bug in debug mode and fix edit prompt bug ([ffb10f2](https://github.com/PromptPal/web/commit/ffb10f25fec3e6fb416ecccfa64012e67d5f25a5))
* **prompt:** update prompt debug messages ([b6a01ff](https://github.com/PromptPal/web/commit/b6a01ffd6985a954d003cd795acb4d6f3ec7fc5f))

## [1.6.0](https://github.com/PromptPal/web/compare/v1.5.2...v1.6.0) (2024-02-24)


### Features

* **app:** update routes for better design and gemini support ([cb406af](https://github.com/PromptPal/web/commit/cb406afcc1a75260ac429c4c5a0988f614996067))
* **app:** update the deps ([122a681](https://github.com/PromptPal/web/commit/122a681f318d4c3d3133ffd6e58c0f25f2ee39ae))
* **docs:** add help info if user has no data at first scene ([e56bd1b](https://github.com/PromptPal/web/commit/e56bd1ba69de0ee5dd88e939ba1e84bca28cdd2b))
* **gemini:** add gemini support ([1551bb3](https://github.com/PromptPal/web/commit/1551bb3bea4d8284e4c7cd50c81d5c91eab18de4))


### Bug Fixes

* **ci:** upgrade ci actions ([f446394](https://github.com/PromptPal/web/commit/f4463949e7ba025cef372be330df5c2b59fd41b2))
* **css:** update tailwindcss configuration to respect color scheme set by mantine ([aa59ee7](https://github.com/PromptPal/web/commit/aa59ee79c929fea80e700b0937e4afcb515ddae5))
* **deps:** fix signature in request fn to fix ts issues ([a45ce29](https://github.com/PromptPal/web/commit/a45ce297606a443639d43846f7b97e5fb0565982))
* **deps:** upgrade deps ([1f0d1ac](https://github.com/PromptPal/web/commit/1f0d1acbe550588329e52d11bd0b653d86a26d2b))
* **overall:** make chart theme respect global theme config ([6b39db5](https://github.com/PromptPal/web/commit/6b39db558ba22c85153c89a20a342e8ff6f0eb42))
* **project:** fix project updater ([f95cd7b](https://github.com/PromptPal/web/commit/f95cd7b5833701f3ff3518732292248ee2c283e5))

## [1.5.2](https://github.com/PromptPal/web/compare/v1.5.1...v1.5.2) (2023-10-29)


### Bug Fixes

* **app:** await metamask init ([5117fee](https://github.com/PromptPal/web/commit/5117fee8345d6ef947c9b5cdd3f22eb2f114c2a7))

## [1.5.1](https://github.com/PromptPal/web/compare/v1.5.0...v1.5.1) (2023-10-28)


### Bug Fixes

* **openai:** support more models and make test accpet more context ([d4aa7f5](https://github.com/PromptPal/web/commit/d4aa7f55764733af73db880fc48f24c5a8670110))

## [1.5.0](https://github.com/PromptPal/web/compare/v1.4.2...v1.5.0) (2023-10-26)


### Features

* **promptcall:** add variables info when prompt debugging ([076d643](https://github.com/PromptPal/web/commit/076d64347849cbd9f27f071745fcf386ebac2b5d))


### Bug Fixes

* **app:** upgrade packages version and fix test prompt bug ([664f362](https://github.com/PromptPal/web/commit/664f362faec609ba7430347c5cabe9d8acf11b15))

## [1.4.2](https://github.com/PromptPal/web/compare/v1.4.1...v1.4.2) (2023-10-01)


### Bug Fixes

* **app:** fix http request and make prompt be able to debug ([b035988](https://github.com/PromptPal/web/commit/b035988b12ecab33a531432fbcc99e0f24eb34bd))

## [1.4.1](https://github.com/PromptPal/web/compare/v1.4.0...v1.4.1) (2023-08-24)


### Bug Fixes

* **app:** add basic build info and fix refetch logic after commit ([77219e8](https://github.com/PromptPal/web/commit/77219e8e79f03cfb31131cd5735b54e35726210a))

## [1.4.0](https://github.com/PromptPal/web/compare/v1.3.0...v1.4.0) (2023-08-24)


### Features

* **prompts:** update styles of prompt ([63ebfd9](https://github.com/PromptPal/web/commit/63ebfd9dd622cccc53aa662cdb5a15da4187267b))


### Bug Fixes

* **project:** fix project creation ([7abbdf1](https://github.com/PromptPal/web/commit/7abbdf166eb924fd92da75163a1b7d4f153ef91d))

## [1.3.0](https://github.com/PromptPal/web/compare/v1.2.1...v1.3.0) (2023-08-06)


### Features

* **ci:** add generate graphql phase for ci ([932b3ff](https://github.com/PromptPal/web/commit/932b3ffb20141b4f51bfab6669cd3292b588df3d))
* **gql:** add gql integration ([d555969](https://github.com/PromptPal/web/commit/d555969357d7bf6b10f9b59516f77cd70fb056e8))
* **graphql:** migrating api to graphql based ([9e04896](https://github.com/PromptPal/web/commit/9e0489607d6fa4d574af5552c68f8a96f2cb7f20))
* **graphql:** upgrade to graphql api ([20869a0](https://github.com/PromptPal/web/commit/20869a06c88c4fd2c51621cc59c1da348c7b8c23))
* **graphql:** upgrade to graphql api ([fd2b944](https://github.com/PromptPal/web/commit/fd2b9448be5b695e5c82f085b0d3768f2157cc48))
* **project:** use graphql api ([7f64ff3](https://github.com/PromptPal/web/commit/7f64ff30cf239b7c1e4784f9fa024d1332fd3f13))


### Bug Fixes

* **ci:** add debug info ([db34fa9](https://github.com/PromptPal/web/commit/db34fa9bdebb7a500a95c62d3cc5a08bc102a271))
* **ci:** add debug info ([db34fa9](https://github.com/PromptPal/web/commit/db34fa9bdebb7a500a95c62d3cc5a08bc102a271))
* **ci:** add debug info ([d4c972c](https://github.com/PromptPal/web/commit/d4c972c5cb8f21584299622b131b6e92cabca4b8))
* **ci:** add debug info for ci ([99f1b9e](https://github.com/PromptPal/web/commit/99f1b9eb623e76ee1202091f69d9161e3fdbfcb3))
* **ci:** debug ci ([e616bb0](https://github.com/PromptPal/web/commit/e616bb09509e9223481827702d52856acba1d774))
* **ci:** fix ci ([db34fa9](https://github.com/PromptPal/web/commit/db34fa9bdebb7a500a95c62d3cc5a08bc102a271))
* **ci:** fix schema repo destination ([e45ac1a](https://github.com/PromptPal/web/commit/e45ac1a3ae7305d6e4b3b9510b66e8b518600f06))
* **graphql:** use dynmaic http endpoint ([11355b9](https://github.com/PromptPal/web/commit/11355b9e6b3fb8352844dead099688047ec3835d))
* **http:** remove token and reload app if got 401 ([3c9e9bc](https://github.com/PromptPal/web/commit/3c9e9bcfc59c1585ace77aab93766299655567f6))

## [1.2.1](https://github.com/PromptPal/web/compare/v1.2.0...v1.2.1) (2023-07-20)


### Bug Fixes

* **prompt:** some bugfix and be able to update prompt ([cec663c](https://github.com/PromptPal/web/commit/cec663cf365aa95c01c03c1099eb9e44ddecb33d))

## [1.2.0](https://github.com/PromptPal/web/compare/v1.1.0...v1.2.0) (2023-07-18)


### Features

* **overall:** add overall page and update some styles ([7c8a168](https://github.com/PromptPal/web/commit/7c8a168b4a349c2f59651822e63413ae398a7c8e))

## [1.1.0](https://github.com/PromptPal/web/compare/v1.0.1...v1.1.0) (2023-07-15)


### Features

* **app:** add app icon ([612bd81](https://github.com/PromptPal/web/commit/612bd81afa3079883198808142eac4ff758b2240))
* **project:** add top prompts display ([a813ef8](https://github.com/PromptPal/web/commit/a813ef89e20633631bdea7904bf26df12e57dab3))
* **prompt:** add prompt calls ([bbfdac3](https://github.com/PromptPal/web/commit/bbfdac370a21e6e342a9f3012bfd56d43814e79f))


### Bug Fixes

* **lint:** run eslint autofix ([16757a5](https://github.com/PromptPal/web/commit/16757a5fee2328f73e84540d055215580b06581f))

## [1.0.1](https://github.com/PromptPal/web/compare/v1.0.0...v1.0.1) (2023-07-09)


### Bug Fixes

* **ci:** fix build arguments. get ready for real release ([2e18a80](https://github.com/PromptPal/web/commit/2e18a80ce4a6555e99349a5e576e0273e5b9ff44))

## 1.0.0 (2023-07-09)


### Features

* **app:** add basic support ([3664686](https://github.com/PromptPal/web/commit/3664686fbdbb033ae61e145da90cb333b7d2d206))
* **app:** add login method and more pages ([e3de3cf](https://github.com/PromptPal/web/commit/e3de3cfbdee66cb43cb11160c8df43e6337544d3))
* **app:** init project ([1008309](https://github.com/PromptPal/web/commit/100830917962b62666c4abdc128b4997afa6b174))
* **ci:** update ci ([0680311](https://github.com/PromptPal/web/commit/06803115945344f19196513fd0defcabb0aa78c4))
* **openToken:** add openToken component ([4e1bea5](https://github.com/PromptPal/web/commit/4e1bea53ef26b5e5eb804ac10809cac66c8b3eaa))
* **project:** add project creation modal ([a0235f4](https://github.com/PromptPal/web/commit/a0235f4cfd569ff0b42a022c84dfb565412f1f30))
* **project:** add project list ([b0c0671](https://github.com/PromptPal/web/commit/b0c067193160662d2e51e5467fa1a02187d672b4))
* **prompt:** add create prompt form ([db13d95](https://github.com/PromptPal/web/commit/db13d95156831ae40025d46a57328eb26e0d4aac))
* **prompt:** add prompts form ([2496b3a](https://github.com/PromptPal/web/commit/2496b3a054463dba0def0239e3dfa285aa6b2d33))
* **prompt:** update prompt creation ([8b64e98](https://github.com/PromptPal/web/commit/8b64e98306fad7a592a62ae719cea13fb1290cc4))
* **router:** updated router to react-router ([cd67acd](https://github.com/PromptPal/web/commit/cd67acd055f4281f8aa287d6cfe77ab33dd83370))
* **routes:** update some routes ([b39576f](https://github.com/PromptPal/web/commit/b39576f288f126846583eb1571f911af66e72c80))
* **style:** add style ([a71dd03](https://github.com/PromptPal/web/commit/a71dd03ceefbe08d6a3ad19aedfe55a5dd193f2f))


### Bug Fixes

* **app:** fix openToken form ([2de76df](https://github.com/PromptPal/web/commit/2de76df8661b29b5fdce11ac9efdcdf036b2542b))
