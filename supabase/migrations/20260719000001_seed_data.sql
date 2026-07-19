-- Seed: 16 이음 타입 정의
INSERT INTO type_definitions (type_code, title, description, emoji, recommendations) VALUES
('ACHR', '활력 동행형', '사람과 함께 움직이며 새로운 경험을 즐기는 타입', '🌿', ARRAY['아침 산책', '등산', '여행 모임', '건강 챌린지']),
('ACHF', '활력 탐험형', '함께 새로운 곳을 탐험하며 건강을 챙기는 타입', '🌄', ARRAY['근교 나들이', '체험 활동', '등산', '여행']),
('ACLR', '활력 교류형', '사람들과 함께 배우고 성장하는 활동적인 타입', '🎯', ARRAY['문화 체험', '단체 학습', '등산', '여행']),
('ACLF', '활력 발견형', '새로운 경험과 사람을 만나며 즐기는 타입', '✨', ARRAY['문화 행사', '체험 모임', '나들이', '카페 모임']),
('ASHR', '건강 루틴형', '규칙적인 운동과 건강 관리를 소중히 하는 타입', '🚶', ARRAY['걷기', '운동', '생활습관 모임', '아침 산책']),
('ASHF', '건강 여유형', '건강을 챙기되 자유롭게 참여하는 타입', '🧘', ARRAY['산책', '요가', '건강 강좌', '자연 속 힐링']),
('ASLR', '건강 성장형', '건강과 학습을 규칙적으로 실천하는 타입', '📖', ARRAY['건강 강좌', '운동 클래스', '독서', '취미 교실']),
('ASLF', '건강 자유형', '건강에 관심 있지만 부담 없이 참여하는 타입', '🌱', ARRAY['가벼운 운동', '건강 세미나', '산책', '취미 활동']),
('PCHR', '따뜻한 이야기형', '정기적으로 사람들과 대화하며 교류하는 타입', '☕', ARRAY['카페 모임', '문화생활', '독서 모임', '이야기 나눔']),
('PCHF', '따뜻한 만남형', '편안한 분위기에서 다양한 사람을 만나는 타입', '🤝', ARRAY['카페 모임', '문화 행사', '친목 모임', '전시 관람']),
('PCLR', '따뜻한 배움형', '사람들과 함께 꾸준히 배우고 성장하는 타입', '📚', ARRAY['독서 모임', '문화 강좌', '카페 토론', '취미 클래스']),
('PCLF', '따뜻한 교류형', '편안한 대화와 문화 활동을 즐기는 타입', '🎭', ARRAY['카페 모임', '문화생활', '독서', '전시 관람']),
('PSHR', '건강 동행형', '소수와 함께 규칙적으로 건강 활동을 하는 타입', '🏃', ARRAY['걷기', '운동', '건강 모임', '아침 산책']),
('PSHF', '건강 여유 동행형', '친한 사람과 가볍게 건강을 챙기는 타입', '🌸', ARRAY['산책', '가벼운 운동', '건강 이야기', '자연 나들이']),
('PSLR', '조용한 성장형', '혼자 또는 소수와 깊이 배우고 성장하는 타입', '✍️', ARRAY['글쓰기', '강좌', '취미 클래스', '독서']),
('PSLF', '조용한 탐구형', '조용히 새로운 것을 배우고 경험하는 타입', '🔍', ARRAY['독서', '취미 클래스', '문화 강좌', '글쓰기']);

-- Seed: 12문항 (축당 3문항)
INSERT INTO questions (sort_order, question, option_a, option_b, axis, option_a_value, option_b_value) VALUES
-- Axis 1: Activity (A/P)
(1,  '휴일에 가장 하고 싶은 것은?',           '새로운 곳을 방문하거나 여행하기',     '카페에서 대화하거나 조용히 쉬기',       'activity',      'A', 'P'),
(2,  '좋아하는 여가 시간은?',                 '걷기, 체험, 야외 활동',               '독서, TV, 조용한 취미',                 'activity',      'A', 'P'),
(3,  '새로운 경험에 대한 생각은?',             '새로운 것을 시도하는 것이 즐겁다',    '익숙하고 편안한 것이 좋다',             'activity',      'A', 'P'),
-- Axis 2: Relationship (C/S)
(4,  '새로운 사람을 만날 때 나는?',           '먼저 인사하고 대화를 시작한다',       '상대방이 먼저 다가오길 기다린다',       'relationship',  'C', 'S'),
(5,  '모임에서 선호하는 분위기는?',           '여러 사람과 함께 활기차게',           '소수와 깊은 대화',                      'relationship',  'C', 'S'),
(6,  '친구 관계에서 중요한 것은?',             '다양한 사람과의 넓은 관계',           '몇 명과의 깊은 관계',                   'relationship',  'C', 'S'),
-- Axis 3: Interest (H/L)
(7,  '요즘 관심 있는 것은?',                  '운동, 산책, 건강 관리',               '문화, 공부, 새로운 배움',               'interest',      'H', 'L'),
(8,  '시간을 보낼 때 더 끌리는 것은?',        '몸을 움직이는 활동',                  '머리를 쓰는 활동',                      'interest',      'H', 'L'),
(9,  '관심 분야를 고른다면?',                 '건강, 운동, 웰니스',                  '문화, 예술, 학습',                      'interest',      'H', 'L'),
-- Axis 4: Participation (R/F)
(10, '모임 참여 방식은?',                     '정기적으로 같은 모임에 참여',         '가끔 새로운 모임에 참여',               'participation', 'R', 'F'),
(11, '일정 관리 스타일은?',                   '규칙적인 루틴을 선호',                '그때그때 자유롭게',                     'participation', 'R', 'F'),
(12, '활동 참여 빈도는?',                     '매주 정기적으로',                     '관심 있을 때 가끔',                     'participation', 'R', 'F');

-- Seed: Type → Category rules
INSERT INTO type_category_rules (type_code, category, priority) VALUES
-- ACHR: 활력 동행형
('ACHR', 'walking', 1), ('ACHR', 'hiking', 2), ('ACHR', 'travel', 3), ('ACHR', 'health', 4),
-- ACHF: 활력 탐험형
('ACHF', 'travel', 1), ('ACHF', 'hiking', 2), ('ACHF', 'social', 3),
-- ACLR: 활력 교류형
('ACLR', 'hiking', 1), ('ACLR', 'culture', 2), ('ACLR', 'class', 3), ('ACLR', 'travel', 4),
-- ACLF: 활력 발견형
('ACLF', 'culture', 1), ('ACLF', 'social', 2), ('ACLF', 'cafe', 3),
-- ASHR: 건강 루틴형
('ASHR', 'walking', 1), ('ASHR', 'exercise', 2), ('ASHR', 'health', 3),
-- ASHF: 건강 여유형
('ASHF', 'walking', 1), ('ASHF', 'health', 2), ('ASHF', 'exercise', 3),
-- ASLR: 건강 성장형
('ASLR', 'health', 1), ('ASLR', 'class', 2), ('ASLR', 'reading', 3), ('ASLR', 'exercise', 4),
-- ASLF: 건강 자유형
('ASLF', 'walking', 1), ('ASLF', 'health', 2), ('ASLF', 'class', 3),
-- PCHR: 따뜻한 이야기형
('PCHR', 'cafe', 1), ('PCHR', 'culture', 2), ('PCHR', 'reading', 3), ('PCHR', 'social', 4),
-- PCHF: 따뜻한 만남형
('PCHF', 'cafe', 1), ('PCHF', 'culture', 2), ('PCHF', 'social', 3),
-- PCLR: 따뜻한 배움형
('PCLR', 'reading', 1), ('PCLR', 'class', 2), ('PCLR', 'culture', 3), ('PCLR', 'cafe', 4),
-- PCLF: 따뜻한 교류형
('PCLF', 'cafe', 1), ('PCLF', 'culture', 2), ('PCLF', 'reading', 3),
-- PSHR: 건강 동행형
('PSHR', 'walking', 1), ('PSHR', 'exercise', 2), ('PSHR', 'health', 3),
-- PSHF: 건강 여유 동행형
('PSHF', 'walking', 1), ('PSHF', 'health', 2),
-- PSLR: 조용한 성장형
('PSLR', 'writing', 1), ('PSLR', 'class', 2), ('PSLR', 'reading', 3),
-- PSLF: 조용한 탐구형
('PSLF', 'reading', 1), ('PSLF', 'class', 2), ('PSLF', 'writing', 3);

-- Seed: Sample meetups (경기/서울 지역)
INSERT INTO meetups (title, description, category, region, location_name, scheduled_at, max_participants) VALUES
('미사 호수공원 아침 산책', '아침 공기를 마시며 함께 걷는 모임입니다.', 'walking', '경기 하남', '미사 호수공원', NOW() + INTERVAL '3 days', 8),
('근교 나들이 친구 찾기', '가까운 곳으로 가볍게 나들이를 떠나요.', 'travel', '경기 하남', '하남시 일대', NOW() + INTERVAL '5 days', 6),
('카페에서 이야기 나누기', '편안한 카페에서 차 한 잔과 대화를 나눠요.', 'cafe', '경기 하남', '미사역 카페거리', NOW() + INTERVAL '2 days', 6),
('건강 걷기 챌린지', '매주 정기적으로 함께 걷는 건강 모임입니다.', 'exercise', '서울 강동', '천호동 공원', NOW() + INTERVAL '4 days', 10),
('독서 모임 - 이번 달의 책', '한 권의 책을 함께 읽고 이야기 나눠요.', 'reading', '경기 하남', '하남 도서관', NOW() + INTERVAL '7 days', 8),
('문화 전시 관람', '이번 주 새 전시를 함께 관람해요.', 'culture', '서울 강동', '강동아트센터', NOW() + INTERVAL '6 days', 6),
('등산 - 청계산 가벼운 코스', '초보자도 OK! 가벼운 등산 모임입니다.', 'hiking', '경기 성남', '청계산 입구', NOW() + INTERVAL '8 days', 8),
('글쓰기 취미 클래스', '일기와 수필을 함께 써보는 모임입니다.', 'writing', '경기 하남', '하남 문화센터', NOW() + INTERVAL '10 days', 6),
('건강 세미나 - 혈압 관리', '전문가와 함께하는 건강 정보 세미나.', 'health', '경기 하남', '하남 건강센터', NOW() + INTERVAL '9 days', 20),
('취미 교실 - 서예 입문', '서예를 처음 시작하는 분들을 위한 클래스.', 'class', '서울 강동', '강동구민회관', NOW() + INTERVAL '12 days', 8);
