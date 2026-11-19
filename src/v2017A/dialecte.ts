import { NSD_DIALECTE } from './declaration.constants'

import { createProjectFactory } from '@dialecte/core'

/**
 * Create an NSD project from the declaration (`NSD_DIALECTE`): both configs, its extensions under the caller's. Storage
 * defaults to the local store. Call .open(name) to initialize the store and hydrate state. The factory carries the
 * declaration (`createNsdProject.dialecte`) and deletes an NSD project without opening it
 * (`createNsdProject.destroyProject({ name, storage })`).
 *
 * Marked pure: a consumer importing only the declaration leaves it out of its bundle.
 *
 * @intent open an NSD project, import and edit NSD files, register custom extensions on an NSD project, delete an NSD project without opening it
 */
export const createNsdProject = /* @__PURE__ */ createProjectFactory({ dialecte: NSD_DIALECTE })
