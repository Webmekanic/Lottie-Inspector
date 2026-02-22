import { ChevronDown, ChevronRight, FileCode } from 'lucide-react';
import * as S from '../../../styles/LeftPanelStyles';
import { ShapeTreeNode } from '../../../utils/shapeTreeUtils';

interface ShapeNodeProps {
  node: ShapeTreeNode;
  depth: number;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
}

export function ShapeNode({ node, depth, expandedNodes, onToggle }: ShapeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <S.ShapeNodeContainer $depth={depth}>
        {hasChildren ? (
          <S.ExpandButton onClick={() => onToggle(node.id)}>
            {isExpanded ? (
              <ChevronDown size={10} color="#71717a" />
            ) : (
              <ChevronRight size={10} color="#71717a" />
            )}
          </S.ExpandButton>
        ) : (
          <S.ShapeNodeSpacer />
        )}

        <FileCode size={10} color="#52525b" style={{ flexShrink: 0 }} />

        <S.ShapeNodeName>{node.name}</S.ShapeNodeName>
        <S.ShapeNodeType>{node.type}</S.ShapeNodeType>
      </S.ShapeNodeContainer>

      {hasChildren && isExpanded &&
        node.children!.map((child) => (
          <ShapeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
          />
        ))}
    </div>
  );
}
