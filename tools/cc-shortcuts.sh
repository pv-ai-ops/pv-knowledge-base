#!/bin/bash

# Claude Code 简化启动命令
# 为了简化 --dangerously-skip-permissions 这个长参数的输入

# ccd = claude dangerous - 危险模式简化启动 (原版配置)
# 清除cc设置的环境变量，使用原版Claude Code + 默认64000 tokens
ccd() {
    # 清除cc命令设置的所有环境变量
    unset ANTHROPIC_BASE_URL
    unset ANTHROPIC_API_KEY
    unset CLAUDE_CODE_MAX_OUTPUT_TOKENS
    
    # 设置默认的最大输出tokens
    export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
    
    # 执行原版Claude Code危险模式
    claude --dangerously-skip-permissions "$@"
}

# 注意：函数在当前shell会话中可用，如需在子shell中使用请重新source此文件

echo "Claude Code shortcuts loaded:"
echo "  ccd - claude --dangerously-skip-permissions (original config + 64000 tokens)"