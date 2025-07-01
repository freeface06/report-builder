# 📄 ICT 팀 프로젝트 보고서 빌더

## 🎯 프로젝트 개요

이 프로젝트는 React 기반의 **보고서 빌더 자동화 시스템**입니다.  
사용자가 라벨, 테이블, 이미지 등의 컴포넌트를 드래그 앤 드롭 방식으로 배치하여 보고서를 구성하고, **Preview 및 PDF 출력 기능**까지 제공하는 **웹 기반 에디터 플랫폼**입니다.

---

## 🤖 Claude 프로젝트: 보고서 빌더 자동화 시스템

### 👤 역할

Claude는 10년 이상의 경력을 지닌 시니어 풀스택 개발자 역할을 맡습니다.  
모든 개발은 자율 에이전트 시스템에 의해 자동화되며, 고객 개입 없이 요구사항 분석부터 구현, 테스트, 결과물 산출까지 수행합니다.

### 🧠 시스템 아키텍처

```
고객 요청 → [Orchestrator] → [Planning Agent] → [Architecture Agent] → [Code Agent] → [Testing Agent] → 최종 결과물
```

---

## ✅ 현재 구현된 기능

- 라벨, 테이블, 이미지 컴포넌트 사이드바 제공
- 컴포넌트를 캔버스로 드래그 앤 드롭 가능
- 각 컴포넌트는 고유 ID 및 위치 정보 포함
- 라벨 더블클릭 시 텍스트 입력 가능 (Enter 또는 blur 시 저장)
- `react-rnd`로 컴포넌트 이동/크기 조절 가능
- 클릭 시 삭제 버튼 표시 및 제거 동작 구현
- Preview 모드로 전환 가능 (읽기 전용)
- 테이블: 행/열 추가 가능, 셀 데이터 입력 가능

---

## ❌ 부족한 기능 및 개선 요청 사항

### 1. 테이블 기능 개선

- [ ] 셀 병합 (colspan, rowspan)
- [ ] 셀 삭제 기능
- [ ] 셀 단위 크기 조절 기능
- [ ] Tab/Enter 키 기반 셀 이동
- [ ] 키보드 방향키 이동 지원
- [ ] `tableData`는 `string[][]` 구조로 유지 관리

### 2. Preview 기능 확장

- [ ] `html2canvas` + `jsPDF` 활용한 PDF 출력
- [ ] 인쇄용 레이아웃(A4 등) 지원
- [ ] 편집 UI 요소 제거 (드래그 핸들, 버튼 등)

### 3. UI 속성 편집 기능 추가

- [ ] 폰트 크기, 색상, 배경색 설정
- [ ] 텍스트 정렬 (좌/우/가운데)
- [ ] bold, italic, underline 지원
- [ ] 선택된 컴포넌트 속성 편집 패널 제공
- [ ] 각 컴포넌트에 `style` 속성 추가 및 반영

### 4. UI 디자인 개선

- [ ] 전체 UI를 [`shadcn/ui`](https://ui.shadcn.com) 기반으로 재구성
- [ ] 모든 버튼, 입력창, 토글 등을 일관된 UI 컴포넌트로 전환

### 5. 테스트 환경 구축

- [ ] `npm test` 실패 원인: ESM 관련 Jest 오류
- [ ] `ts-jest` 또는 `babel-jest` 설정 필요
- [ ] `jest.config.ts` 예시:
  ```ts
  transform: {
    "^.+\.(ts|tsx)$": "ts-jest"
  }
  ```

---

## 🧾 ReportComponent 타입 예시

```ts
interface ReportComponent {
  id: number;
  type: 'label' | 'table' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  tableData?: string[][];
  style?: {
    fontSize?: number;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline';
    color?: string;
    backgroundColor?: string;
  };
}
```

---

## 📦 Git 커밋 정책 (중요)

### 커밋 규칙

- 파일 변경/생성/삭제 즉시 커밋
- 기능 단위로 명확한 메시지 작성

### 커밋 메시지 예시

```bash
feat: 테이블 셀 병합 기능 추가

- tableData 구조 확장
- 병합 로직 추가 및 셀 렌더링 처리
- 병합 후 스타일 및 이동 동작 확인

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 커밋 타입 분류

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `docs`: 문서 변경
- `style`: 코드 포맷 정리
- `chore`: 설정 변경, 패키지 설치 등

---

## 📊 기대 효과

- 80% 이상 개발 속도 향상
- 코드 품질 일관성 확보
- 반복 작업 자동화 → 창의적 업무 집중
- 24시간 개발 대응 가능

---

## ⚠️ 유의사항

- 외부 네트워크 접근이 필요한 경우 명시
- Claude는 README.md의 내용을 기반으로 전체 프로젝트 방향을 파악하며 개발합니다
