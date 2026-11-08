// The NSD declaration served as a project engine, for the tests that open a project on sqlite storage.
import { serveSqliteEngine } from '@dialecte/core/sqlite'

import { NSD_DIALECTE } from '@/v2017A/declaration.constants'

serveSqliteEngine({ dialectes: [NSD_DIALECTE] })
