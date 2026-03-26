@AGENTS.md

# 프로젝트 규칙
- 모든 답변은 한국어로 작성되어야 한다.

# 프롬프팅 규칙
- 프롬프팅 결과는 수행하기 전 반드시 사용자에게 승인 절차를 거친 뒤 수행한다.

# 기술 스택
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Language: TypeScript

# 코드 규칙
- 컴포넌트는 함수형으로 작성한다.
- 파일명은 PascalCase (컴포넌트), camelCase (유틸/훅) 로 작성한다.
- 컴포넌트 props는 반드시 interface로 타입 정의한다.
- 절대경로 import를 사용한다. (@/components/...)

# 폴더 구조
- 컴포넌트: src/components/
- 페이지: src/app/
- 훅: src/hooks/
- 타입: src/types/
- 유틸: src/utils/

# 작업 규칙
- 새 파일 생성 전 기존 파일 구조를 먼저 파악한다.
- 기존 코드 스타일을 유지한다.
- 임의로 라이브러리를 추가하지 않는다. 필요 시 먼저 제안한다.