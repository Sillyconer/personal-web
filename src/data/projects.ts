import type { ProjectDefinition } from '../types/site';

import { mapperProject } from '../content/projects/mapper';
import { personalwebProject } from '../content/projects/personalweb';

export const projects: ProjectDefinition[] = [mapperProject, personalwebProject];

export const featuredProjects = projects.filter((project) => project.featured);
