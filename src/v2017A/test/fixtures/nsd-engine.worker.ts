// The NSD declaration served as a project engine, for the tests that open a project on sqlite storage.
import { serveDialecteEngine } from '@dialecte/core/engine'

import { NSD_DIALECTE } from '@/v2017A/declaration.constants'

serveDialecteEngine({ dialecte: NSD_DIALECTE })
