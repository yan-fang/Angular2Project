import * as ts from 'typescript';
import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static readonly metadata: Lint.IRuleMetadata = {
    ruleName: 'c1-no-imports',
    description: Lint.Utils.dedent`
      Enforces that one @c1 root-level package cannot get into the internals of another @c1 root-level package `,
    rationale: Lint.Utils.dedent`
      Without this rule, @c1 packages will depend on each other's internals, which may be hard to untangle in the future.`,
    optionsDescription: Lint.Utils.dedent`
      An argument boolean may be optionally provided, with the following properties:

      * \`c1NoImports = true\`: disallows @c1 root-level package to get into the internals of another @c1 root-level package 
      i.e: (\`import button from '@c1/components/button'\`) will return an error. 
      i.e  (\`import { button } from '@c1/components'\`) will pass.
      `,
    optionExamples: ['[true, {"noExplicitBarrels": false, "fileExtensions": ["ts", "js"]}]'],
    options: {
      type: 'boolean'
    },
    type: 'maintainability',
    typescriptOnly: true
  };

  static FAILURE = 'import from @c1 scope is only allowed at root-level';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new C1NoInternalImportsWalker(sourceFile, this.getOptions()));
  }
}

// The walker takes care of all the work.
class C1NoInternalImportsWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const importPath = (node.moduleSpecifier as any).text as string;

    if (importPath.indexOf('@c1/') >= 0 && importPath.split('/').length > 2) {
      // create a failure at the current position
      this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE));
    }

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}
