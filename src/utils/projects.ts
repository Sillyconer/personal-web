import { projects } from '../data/projects';
import type { ProjectDefinition } from '../types/site';

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);

export const getProjectLink = (project: ProjectDefinition, kind: ProjectDefinition['links'][number]['kind']) =>
  project.links.find((link) => link.kind === kind);

export const hasPrivateProjectSections = (project: ProjectDefinition) =>
  project.sections.some((section) => section.ownerOnly);
