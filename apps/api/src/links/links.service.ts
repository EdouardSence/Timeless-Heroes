import { Injectable } from '@nestjs/common';

import { Link, CreateLinkDto, UpdateLinkDto } from '@repo/api';

@Injectable()
export class LinksService {
  private readonly _links: Link[] = [
    {
      id: 0,
      title: 'Installation',
      url: 'https://turborepo.dev/docs/getting-started/installation',
      description: 'Get started with Turborepo in a few moments using',
    },
    {
      id: 1,
      title: 'Crafting',
      url: 'https://turborepo.dev/docs/crafting-your-repository',
      description: 'Architecting a monorepo is a careful process.',
    },
    {
      id: 2,
      title: 'Add Repositories',
      url: 'https://turborepo.dev/docs/getting-started/add-to-existing-repository',
      description:
        'Turborepo can be incrementally adopted in any repository, single or multi-package, to speed up the developer and CI workflows of the repository.',
    },
  ];

  private escapeHtml(input: string | null | undefined): string {
    if (input == null) return '';
    return input.replace(/[&<>"'/]/g, (char) => {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        case '/':
          return '&#x2F;';
        default:
          return char;
      }
    });
  }

  create(createLinkDto: CreateLinkDto) {
    return `TODO: This action should add a new link '${this.escapeHtml(createLinkDto.title)}'`;
  }

  findAll() {
    return this._links;
  }

  findOne(id: number) {
    return `TODO: This action should return a Link with id #${id}`;
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `TODO: This action should update a #${id} link ${updateLinkDto.title}`;
  }

  remove(id: number) {
    return `TODO: This action should remove a #${id} link`;
  }
}
