# PRD — Pikachu Nối Hình: Màn "Boss" (1 Vòng)

## 1. Tổng quan

Một màn chơi đơn (single round) độ khó "boss" cho game Pikachu nối hình trên nền web, chơi được trên iPad. Người chơi phải dọn sạch toàn bộ lưới gồm 96 cặp trong 8 phút, dưới áp lực của cơ chế trọng lực kép (gravity kép) và sinh ô mới (regen).

| Hạng mục | Giá trị |
|---|---|
| Loại màn | Single round, độ khó Boss / Expert |
| Nền tảng | Web (desktop + iPad/Safari, cảm ứng) |
| Mục tiêu | Dọn sạch lưới trước khi hết giờ |
| Số cặp | 96 cặp (192 ô) |
| Thời gian | 8 phút (480 giây) |
| Luật nối | Tối đa 3 đoạn thẳng (≤ 2 lần gấp khúc) |

## 2. Mục tiêu & Tiêu chí thành công

**Mục tiêu sản phẩm:** tạo một thử thách dành cho người chơi chuyên nghiệp, đòi hỏi tốc độ ổn định, đọc lưới động và quản lý áp lực thời gian.

**Tiêu chí thắng:** toàn bộ 192 ô được dọn sạch trước khi đồng hồ về 0.

**Tiêu chí thua:**
- Hết 480 giây mà còn ô trên lưới, hoặc
- Lưới bị regen tràn vượt sức chứa (không còn chỗ sinh ô — xem mục 5.3).

## 3. Luật chơi cốt lõi

- Người chơi chọn 2 ô có cùng hình. Nếu nối được bằng một đường gồm tối đa 3 đoạn thẳng (tối đa 2 lần đổi hướng), đi qua các ô trống hoặc ra ngoài viền lưới, cặp đó được ăn và biến mất.
- Đường nối không được đi xuyên qua ô còn hình khác.
- Khoảng trống viền ngoài lưới được tính là đường đi hợp lệ (luật Pikachu cổ điển).
- **Giữ nguyên giới hạn 3 đoạn** (không siết xuống 2 đoạn).

**UX chọn ô:**
- Tap ô thứ nhất → ô sáng viền (trạng thái *selected*).
- Tap ô thứ hai:
  - Cùng hình **và** nối hợp lệ → ăn cặp (vẽ đường nối, 2 ô biến mất).
  - Cùng hình nhưng **không** nối được → hiện hiệu ứng "không nối được" ngắn, chuyển lựa chọn sang ô vừa tap.
  - Khác hình → chuyển lựa chọn sang ô vừa tap.
- Tap lại đúng ô đang chọn → bỏ chọn.

## 4. Bố cục lưới

| Thuộc tính | Giá trị |
|---|---|
| Kích thước lưới | 16 cột × 12 hàng = 192 ô |
| Trạng thái ban đầu | Kín hoàn toàn, không ô trống |
| Số loại hình | 24 loại, mỗi loại 8 ô (4 cặp) |
| Phân bố | Trải đều, đảm bảo màn luôn có lời giải tại thời điểm bắt đầu |

**Yêu cầu sinh màn:** thuật toán sinh lưới phải đảm bảo tồn tại ít nhất một chuỗi nước đi dọn sạch được lưới (solvable), kiểm tra bằng solver trước khi phát màn.

**Lưu ý lưới đầy lúc bắt đầu:** vì lưới kín hoàn toàn (không ô trống), nước đi đầu chỉ thực hiện được nhờ **đường biên ngoài** (xem mô hình vành biên ở mục 10) — hai ô cùng hình ở rìa nối qua vành ngoài bằng ≤ 3 đoạn. Solver phải tính cả đường biên này khi xác nhận solvable.

## 5. Cơ chế đặc biệt

### 5.1 Gravity kép (Dual Gravity)

Sau **mỗi lần ăn cặp**, các ô còn lại bị dồn theo **hai trục đồng thời** về một góc cố định của lưới.

- Hướng dồn mặc định: **xuống + sang phải** (ô dồn về góc dưới-phải). Ô rơi xuống trước, rồi trượt ngang dồn về phải (hoặc xử lý đồng thời theo vector chéo — xem mục kỹ thuật).
- Hướng dồn **cố định trong suốt vòng chơi** (không đổi hướng ngẫu nhiên ở phiên bản này, để giữ độ khó ở mức "boss" chứ chưa phải "master").
- Animation dồn ô phải mượt; trong lúc animation chạy, khóa input để tránh nối nhầm.

### 5.2 Khoảng trống & đường đi

- Sau khi dồn, khoảng trống tập trung ở góc trên-trái của lưới, mở ra hành lang để vẽ đường nối.
- Người chơi nên ưu tiên tạo và tận dụng khoảng trống này.

### 5.3 Regen (Sinh ô mới)

- Cứ mỗi **45 giây**, hệ thống sinh thêm **1 đợt cặp mới** (mặc định 6 cặp = 12 ô) vào các ô trống, ưu tiên vùng góc trên-trái vừa được dọn.
- **Giới hạn regen (BẮT BUỘC, để màn luôn thắng được):** tối đa **6 đợt** regen, **VÀ không regen trong 120 giây cuối** (sau giây thứ 360). Lý do tính toán xem mục 5.4 — nếu để regen chạy suốt 480s thì tổng khối lượng vượt quá khả năng dọn, màn trở nên bất khả thi.
- Cặp regen phải được sinh sao cho lưới vẫn còn lời giải (solver kiểm tra sau mỗi đợt sinh).
- **Tràn lưới:** nếu đến kỳ regen mà không còn đủ ô trống để sinh cả đợt → người chơi **thua ngay** (lưới tràn). Đây là cơ chế phạt cho người ăn quá chậm.
- Cảnh báo: 5 giây trước mỗi đợt regen, hiển thị hiệu ứng/đếm ngược để người chơi kịp dọn chỗ.

### 5.5 Bế tắc (Deadlock) — không còn nước đi

- Gravity kép có thể tạo ra thế cờ **không còn cặp nào nối được** dù lưới chưa trống. Đây KHÔNG phải lỗi người chơi, nên không được tính thua.
- Sau **mỗi** lần gravity và mỗi đợt regen, hệ thống kiểm tra còn ít nhất 1 nước nối hợp lệ không. Nếu **không còn** và lưới chưa trống → **tự động xáo lại (auto-shuffle) MIỄN PHÍ**: không tốn lượt Shuffle thủ công (mục 6), không trừ giờ. Solver đảm bảo sau xáo có lời giải.
- Auto-shuffle khác Shuffle thủ công: chỉ kích hoạt khi bế tắc, **không giới hạn số lần**.

### 5.4 Cân bằng độ khó

- 96 cặp ban đầu + regen định kỳ trong 480 giây → nhịp yêu cầu khoảng **1 cặp mỗi 3.0–3.5 giây** để theo kịp.
- Người chơi chuyên nghiệp duy trì nhịp này được; người chơi thường sẽ bị regen đuổi kịp và tràn lưới.
- **Bài toán thắng được (lý do cap regen ở 5.3):** trong 480s, nhịp ~3.5s/cặp dọn tối đa ~137 cặp; ~4s/cặp chỉ ~120 cặp. Khởi đầu đã 96 cặp, nên tổng regen phải ≤ ~24–41 cặp thì màn mới khả thi. Cap **6 đợt × 6 cặp = 36 cặp thêm → tổng ~132 cặp**, cộng việc dừng regen ở giây 360 để chừa thời gian dọn nốt. Đây là tham số cân bằng, tinh chỉnh ở mục 12.

## 6. Hỗ trợ trong màn (Power-ups)

| Hỗ trợ | Số lần | Tác dụng |
|---|---|---|
| Hint | 1 | Làm nổi bật 1 cặp nối được hợp lệ |
| Shuffle | 1 | Xáo lại toàn bộ ô còn lại (đảm bảo sau xáo vẫn solvable) |

- Shuffle cũng tuân theo gravity kép sau khi xáo.
- Không cộng/trừ thời gian khi dùng hỗ trợ.

## 7. Hệ thống điểm (tùy chọn)

- Điểm cơ bản mỗi cặp: +100.
- Combo: ăn cặp liên tiếp trong vòng 3 giây cộng hệ số combo tăng dần (x1.1, x1.2, ...), rớt nhịp thì combo reset.
- Bonus thời gian thừa khi thắng: +50 điểm mỗi giây còn lại.
- Điểm chỉ để xếp hạng/khoe, không ảnh hưởng điều kiện thắng-thua.

## 8. Giao diện & Cảm ứng (iPad)

### 8.0 Định nghĩa thành phần HUD (đối chiếu ảnh thiết kế IMG_0991 / IMG_0992)

| Thành phần (theo ảnh) | Ý nghĩa | Trạng thái |
|---|---|---|
| Icon chữ thập CYAN + số "18" (trên-trái) | **BỎ — không hiển thị.** Phần tử này được gỡ khỏi HUD. | Xóa. |
| Chữ "Level 1/13" (giữa-trái) | Nhãn **trang trí** cho khớp ảnh. Bản này chỉ 1 vòng, KHÔNG có 13 level thật. | Cố định hiển thị "Level 1/13". |
| Thanh gradient cầu vồng (giữa) | **Thanh thời gian** — biểu diễn 480 giây còn lại, vơi dần từ phải sang trái. Đây chính là "đồng hồ đếm ngược" nhắc ở dưới. | Có thể kèm số mm:ss nhỏ. |
| Số màu vàng (phải) | **Điểm số** (mục 7). | Có chức năng. |
| Nút NEW | Sinh màn mới / chơi lại. | Có chức năng. |
| Nút ⏸ (Pause) | Tạm dừng — xem state Paused (mục 9). | Có chức năng. |
| Nút 🔇 | Bật/tắt âm thanh (mục 8.1). | Có chức năng. |
| Nút RATE, TOP | Ngoài phạm vi 1 vòng. Mặc định: **trang trí / no-op**. | Đánh dấu trang trí. |
| Nút EXIT | Về màn chờ (có hộp xác nhận). | Có chức năng tối thiểu. |

### 8.1 Âm thanh (tối thiểu)

- SFX khi: ăn cặp, nối sai, cảnh báo regen, thắng, thua. Nhạc nền tùy chọn.
- Nút 🔇 bật/tắt toàn bộ âm thanh, lưu trạng thái trong phiên chơi.
- Nếu muốn bỏ âm thanh hoàn toàn ở bản này, đánh dấu nút 🔇 là trang trí.

### 8.2 Trạng thái hình ảnh cần có

- Ô đang chọn: viền sáng / nhấp nháy.
- Cặp gợi ý (Hint): nhấp nháy 2 ô được gợi ý.
- Đường nối: vẽ polyline khi ăn cặp, tự ẩn sau ~0.2 giây.
- Cảnh báo regen (5s trước): nhấp nháy vùng sắp sinh + đếm ngược trên HUD.
- Overlay Win / Lose / Paused, kèm nút hành động.

### 8.3 Kỹ thuật cảm ứng

- **Pointer Events** (`pointerdown`/`pointerup`) để gom cảm ứng và chuột vào một luồng.
- Mỗi ô tối thiểu **44×44 px** vùng chạm; nếu màn iPad chật, cho phép thu nhỏ lưới có kiểm soát hoặc bố cục responsive.
- Thêm viewport meta: `width=device-width, initial-scale=1, user-scalable=no` để chặn double-tap zoom.
- Gọi `preventDefault()` trên thao tác trên lưới để chặn scroll / pull-to-refresh của Safari.
- Không dùng cơ chế hover; chọn ô bằng tap.
- Hiển thị rõ: đồng hồ đếm ngược, số cặp còn lại, đếm ngược tới đợt regen kế tiếp, nút Hint/Shuffle.
- Render bằng Canvas (hoặc PixiJS) để animation dồn ô và regen mượt với 192 ô.

## 9. Trạng thái màn (State Machine)

1. **Loading** — sinh lưới, chạy solver kiểm tra solvable.
2. **Ready** — hiển thị lưới, đếm ngược 3-2-1.
3. **Playing** — đồng hồ chạy, nhận input, xử lý ăn cặp → gravity → kiểm tra regen → kiểm tra bế tắc (5.5).
4. **Paused** — nhấn ⏸: dừng đồng hồ thời gian, dừng lịch regen, khóa input lưới, hiện overlay tạm dừng + nút Tiếp tục. Bỏ tạm dừng → trở lại Playing, đồng hồ và lịch regen tiếp tục từ thời điểm dừng (không reset chu kỳ regen).
5. **Win** — dọn sạch lưới trước khi hết giờ.
6. **Lose** — hết giờ còn ô, hoặc lưới tràn khi regen.

## 10. Yêu cầu kỹ thuật chính

- **Solver/validator** kiểm tra solvable: lúc sinh màn, sau shuffle, sau mỗi đợt regen.
- **Mô hình vành biên:** coi lưới 16×12 như được bao bởi một vành ô trống bên ngoài (thành lưới ảo 18×14, index 0 và cuối là vành). Đường nối được phép đi trên vành ngoài này (luật Pikachu cổ điển) → lưới đầy lúc bắt đầu vẫn nối được các ô ở rìa.
- **Thuật toán tìm đường** ≤ 3 đoạn (BFS/giới hạn số lần đổi hướng) chạy theo thời gian thực khi người chơi chọn 2 ô, có tính cả vành biên.
- **Phát hiện bế tắc:** sau mỗi gravity/regen, quét mọi cặp cùng hình còn lại tìm ít nhất 1 đường hợp lệ; nếu không có → auto-shuffle (5.5).
- **Gravity kép**: xử lý dồn theo 2 trục nhất quán, khóa input trong animation.
- **Regen scheduler**: hẹn giờ theo 45 giây, kiểm tra chỗ trống và solvable trước khi sinh.
- Khóa input trong các pha animation (gravity, regen, shuffle) để tránh lỗi nối nhầm.

## 11. Ngoài phạm vi (Out of Scope) cho vòng này

- Gravity đổi hướng ngẫu nhiên (để dành cho màn "Master").
- Giảm giới hạn xuống 2 đoạn.
- Ô khóa / ô đá, fog ẩn hình.
- Nhiều màn / hệ thống tiến trình; PRD này chỉ mô tả **một vòng**. ("Level 1/13" trên HUD chỉ là nhãn trang trí cho khớp ảnh.)
- Bảng xếp hạng / đánh giá: nút RATE, TOP là trang trí ở bản này.

## 12. Số liệu cấu hình — bản "GOD MODE" (đã calibrate bằng mô phỏng)

Các giá trị dưới đây được tinh chỉnh để màn **chỉ thắng được nếu giữ nhịp ~1.1 giây/cặp suốt 3 phút**; chậm hơn ~1.2s/cặp là thua (hết giờ hoặc tràn lưới). Mô phỏng: nhịp 0.6–1.1s/cặp → thắng; ≥1.2s/cặp → thua.

| Tham số | Giá trị God Mode |
|---|---|
| Lưới | 16 × 12 |
| Cặp ban đầu | 96 |
| Loại hình | 24 |
| Thời gian | **180 giây** (3 phút) |
| Hướng gravity | Xuống + Phải (cố định) |
| Chu kỳ regen | **16 giây** |
| Số cặp mỗi đợt regen | **8 cặp (16 ô)** |
| Cap số đợt regen | **18 đợt** |
| Ngừng regen sau giây thứ | **150** (30s cuối không regen) |
| Cảnh báo trước regen | 5 giây |
| Auto-shuffle khi bế tắc | Bật, miễn phí, không giới hạn |
| Nhịp mục tiêu (để thắng) | **~1.1 giây/cặp** |
| Giới hạn 3 đoạn | Có |
| Hint / Shuffle (thủ công) | 1 / 1 |
