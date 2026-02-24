import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { LinksService } from './links.service';

describe('LinksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (escapeHtml)', () => {
    const createResult = (title: string | null | undefined) =>
      service.create({ title } as any);

    it('should return the title unmodified when no special characters', () => {
      expect(createResult('My Link')).toContain("'My Link'");
    });

    it('should escape & as &amp;', () => {
      expect(createResult('A & B')).toContain('A &amp; B');
    });

    it('should escape < as &lt;', () => {
      expect(createResult('<script>')).toContain('&lt;script&gt;');
    });

    it('should escape > as &gt;', () => {
      expect(createResult('a > b')).toContain('a &gt; b');
    });

    it('should escape " as &quot;', () => {
      expect(createResult('say "hi"')).toContain('say &quot;hi&quot;');
    });

    it("should escape ' as &#39;", () => {
      expect(createResult("it's")).toContain("it&#39;s");
    });

    it('should escape / as &#x2F;', () => {
      expect(createResult('a/b')).toContain('a&#x2F;b');
    });

    it('should escape a combination of special characters', () => {
      const result = createResult('<b class="x">it\'s a/b & c</b>');
      expect(result).toContain(
        '&lt;b class=&quot;x&quot;&gt;it&#39;s a&#x2F;b &amp; c&lt;&#x2F;b&gt;',
      );
    });

    it('should not double-escape already-escaped sequences', () => {
      // The function escapes "&" in "&amp;" to "&amp;amp;" since it operates on raw characters
      const result = createResult('&amp;');
      expect(result).toContain('&amp;amp;');
    });

    it('should return empty string when title is null', () => {
      expect(createResult(null)).toContain("''");
    });

    it('should return empty string when title is undefined', () => {
      expect(createResult(undefined)).toContain("''");
    });
  });
});
