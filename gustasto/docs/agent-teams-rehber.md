# Agent Teams Rehberi

> Claude Code ile birden çok agent'ı koordineli şekilde çalıştırarak paralel iş akışları oluşturma.

**Kaynak**: https://code.claude.com/docs/en/agent-teams
**Tarih**: 2026-05-28
**Versiyon**: Claude Code v2.1.32+

---

## İçindekiler

- [Giriş](#giriş)
- [Ne Zaman Kullanmalı?](#ne-zaman-kullanmalı)
- [Alt-agent (Subagent) ile Karşılaştırma](#alt-agent-subagent-ile-karşılaştırma)
- [Aktivasyon](#aktivasyon)
- [Takım Kurma](#takım-kurma)
- [Ekran Modları](#ekran-modları)
- [Takımı Kontrol Etme](#takımı-kontrol-etme)
- [Mimari](#mimari)
- [En İyi Pratikler](#en-iyi-pratikler)
- [Kullanım Senaryoları](#kullanım-senaryoları)
- [Sorun Giderme](#sorun-giderme)
- [Limitasyonlar](#limitasyonlar)

---

## Giriş

**Agent Teams**, Claude Code'ün deneysel bir özelliğidir. Birden çok Claude Code instance'ını bir "takım" olarak koordine etmenizi sağlar:

- **Takım lideri (Team Lead)**: Ana Claude Code session'ı. Takımı oluşturur, görev dağıtır, sonuçları sentezler.
- **Takım arkadaşları (Teammates)**: Bağımsız Claude Code instance'ları. Her biri kendi context window'unda çalışır.
- **Paylaşılan görev listesi (Task list)**: Tüm takımın görebileceği ortak iş listesi.
- **Mesajlaşma (Mailbox)**: Agent'lar arası doğrudan iletişim sistemi.

Alt-agent'lardan farklı olarak, takım arkadaşları birbirleriyle doğrudan iletişim kurabilir ve siz de takım liderine gitmeden tek tek takım arkadaşlarınıza mesaj atabilirsiniz.

---

## Ne Zaman Kullanmalı?

### En uygun senaryolar

| Senaryo | Açıklama |
|---------|----------|
| **Araştırma ve inceleme** | Birden çok agent aynı anda farklı açılardan problemi araştırabilir |
| **Yeni modül/feature geliştirme** | Her agent ayrı bir parçayı bağımsızca üstlenebilir |
| **Rekabetçi hipotezlerle hata ayıklama** | Agent'lar farklı teorileri paralelde test eder |
| **Cross-layer koordinasyon** | Frontend, backend ve testler ayrı agent'lara dağıtılabilir |

### Ne zaman KULLANMAMALI?

- **Sıralı işlemler** gerektiğinde (tek session daha iyi)
- **Aynı dosyada** birden çok düzenleme yapılacaksa
- **Çok fazla bağımlılığı** olan işlerde

Agent Teams koordinasyon maliyeti ekler ve tek session'dan **önemli ölçüde fazla token tüketir**.

---

## Alt-agent (Subagent) ile Karşılaştırma

| Özellik | Subagent | Agent Team |
|---------|----------|------------|
| **Context** | Kendi context window'u; sonuçları çağırana döner | Kendi context window'u; tam bağımsız |
| **İletişim** | Sadece ana agent'a rapor verir | Takım arkadaşları birbiriyle direkt mesajlaşır |
| **Koordinasyon** | Ana agent her şeyi yönetir | Paylaşılan task list + self-koordinasyon |
| **En iyi** | Sonuç odaklı, basit görevler | Tartışma ve işbirliği gerektiren işler |
| **Token maliyeti** | Düşük (sonuçlar özetlenir) | Yüksek (her arkadaş ayrı instance) |

**Özet**: Subagent = hızlı, odaklı, tek yönlü. Agent Team = tartışmalı, işbirlikçi, çok yönlü.

---

## Aktivasyon

Agent Teams varsayılan olarak **kapalıdır**. Aktifleştirmek için:

### Yöntem 1: settings.json (proje bazlı)

Projenin `.claude/settings.json` dosyasına ekleyin:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Yöntem 2: Environment variable

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## Takım Kurma

Aktivasyondan sonra, Claude'a doğal dille takım kurmasını söyleyin:

```
Konsol uygulamam için bir agent team oluştur. Üç rol olsun:
- Biri UX üzerine çalışsın
- Biri teknik mimari üzerine çalışsın
- Biri avukat-şeytanı (devil's advocate) rolü yapsın
```

Claude şunları otomatik yapar:
1. Takımı oluşturur
2. Takım arkadaşlarını spawn eder
3. Görevleri dağıtır
4. Paralel çalışmayı başlatır
5. Sonuçları sentezler
6. İş bitince takımı temizler

---

## Ekran Modları

### 1. In-process (Varsayılan)
Tüm takım arkadaşları ana terminal içinde çalışır.
- `Shift+↓` ile takım arkadaşları arasında geçiş
- Her terminalde direkt mesaj yazabilirsiniz
- Herhangi bir terminalde çalışır, ek kurulum gerekmez

### 2. Split panes (tmux / iTerm2)
Her takım arkadaşı kendi bölmesinde görünür.
- Tüm çıktıları aynı anda görebilirsiniz
- Bölmeye tıklayarak direkt etkileşim

### Yapılandırma

`~/.claude/settings.json`:

```json
{
  "teammateMode": "in-process"
}
```

Tek seferlik:

```bash
claude --teammate-mode in-process
```

**Split pane için gerekenler:**
- **[tmux](https://github.com/tmux/tmux/wiki)** (özellikle macOS'te iTerm2 + `tmux -CC` önerilir)
- **iTerm2**: `it2` CLI kurulumu + Python API aktifleştirme (Settings → General → Magic → Enable Python API)

---

## Takımı Kontrol Etme

### Rol ve model belirtme

```text
4 arkadaştan oluşan bir takım kur. Her biri için Sonnet modelini kullan.
```

### Plan onayı zorunluluğu

Karmaşık görevlerde takım arkadaşlarının önce plan yapmasını isteyebilirsiniz:

```text
Auth modülünü refactor etmesi için bir mimar spawn et.
Değişiklik yapmadan önce plan onayı almasını zorunlu kıl.
```

Onay mekanizması:
1. Takım arkadaşı plan yapar → lider onay bekler
2. Lider onaylar veya geri bildirimle reddeder
3. Reddedilirse takım arkadaşı revize eder ve tekrar gönderir
4. Onaylanınca takım arkadaşı uygulamaya başlar

Liderin kararını yönlendirmek için kriter verin:
```text
Sadece test coverage içeren planları onayla.
Database schema'sını değiştiren planları reddet.
```

### Takım arkadaşlarıyla direkt konuşma

- **In-process**: `Shift+↓` ile arkadaşa geç, mesajını yaz, Enter'a bas
- **Split pane**: Arkadaşın bölmesine tıkla, direkt yaz
- **Escape**: Mevcut turu durdur
- **Ctrl+T**: Task list'i aç/kapat

### Görev atama ve claim etme

Paylaşılan task list 3 durum içerir: `pending → in_progress → completed`

- **Lider atar**: "Şu görevi X arkadaşına ver"
- **Self-claim**: Takım arkadaşı bitirdiği görevi takiben sıradaki uygun görevi kendi alır
- **Bağımlılıklar**: Bir task blockedBy ile başka bir task'e bağlanabilir; bağımlılık çözülmeden claim edilemez
- **File locking**: İki arkadaşın aynı görevi almasını engeller

### Takım arkadaşını kapatma

```text
researcher arkadaşından kapanmasını iste
```

Lider shutdown request gönderir. Takım arkadaşı kabul eder (graceful exit) veya gerekçeyle reddeder.

### Takımı temizleme

```text
Takımı temizle
```

**ÖNEMLİ**: Önce tüm arkadaşları kapatın, sonra temizleyin. Temizlik her zaman lider üzerinden yapılmalıdır.

### Quality gates (Hook'lar)

| Hook | Ne Zaman Çalışır |
|------|------------------|
| `TeammateIdle` | Takım arkadaşı boşa çıkmak üzereyken |
| `TaskCreated` | Görev oluşturulurken |
| `TaskCompleted` | Görev tamamlanırken |

Exit code 2 ile çıkarsa, işlemi engeller ve geri bildirim gönderir.

---

## Mimari

### Bileşenler

| Bileşen | Rolü |
|---------|------|
| **Team Lead** | Ana session. Takımı kurar, spawn eder, koordine eder |
| **Teammates** | Ayrı Claude Code instance'ları. Kendi görevlerinde çalışır |
| **Task list** | Paylaşılan iş listesi (`~/.claude/tasks/{team-name}/`) |
| **Mailbox** | Agent'lar arası mesajlaşma sistemi |

### Takım ve task depoları (lokal)

```
~/.claude/teams/{team-name}/config.json   # Takım konfigürasyonu
~/.claude/tasks/{team-name}/              # Task list dosyaları
```

- Takım config'i otomatik oluşturulur/güncellenir
- **Elle düzenlemeyin** - her state güncellemesinde üzerine yazılır
- `members` dizisi: her arkadaşın adı, agent ID'si, agent tipi
- Agent'lar bu dosyayı okuyarak diğer takım arkadaşlarını keşfedebilir

### Subagent tanımlarını takım arkadaşı olarak kullanma

Önceden tanımlanmış bir subagent tipini (proje/kullanıcı/plugin seviyesinde) takım arkadaşı olarak spawn edebilirsiniz:

```text
security-reviewer agent tipini kullanarak auth modülünü denetlemesi için bir takım arkadaşı spawn et.
```

**Önemli**: Subagent tanımındaki `skills` ve `mcpServers` alanları takım arkadaşı olarak çalışırken uygulanmaz. Takım arkadaşları skills ve MCP server'ları normal session gibi proje/kullanıcı ayarlarından yükler.

### Context ve iletişim

- Her takım arkadaşının **kendi context window'u** vardır
- Spawn edilirken **CLAUDE.md, MCP server'lar ve skills**'i yükler
- **Liderin konuşma geçmişini devralmaz**
- Mesajlar **otomatik iletilir** (polling gerekmez)
- Bitince **otomatik bildirim** gönderir

### İzinler

- Takım arkadaşları **liderin izin ayarlarını devralır**
- Lider `--dangerously-skip-permissions` ile çalışıyorsa, tüm takım da öyle çalışır
- Spawn sonrası bireysel mod değiştirilebilir, ancak spawn anında set edilemez

---

## En İyi Pratikler

### 1. Yeterli context verin

Takım arkadaşları liderin konuşma geçmişini görmez. Spawn prompt'unda detay verin:

```text
"src/auth/ dizinindeki auth modülünü güvenlik açıkları için incele.
Token yönetimi, session handling ve input validation'a odaklan.
Uygulama JWT token'larını httpOnly cookie'lerde saklıyor.
Raporunda her bulguya severity (ciddiyet) derecesi ekle."
```

### 2. Takım büyüklüğü

- **3-5 arkadaş** çoğu iş için idealdir
- Token maliyeti lineer artar
- 5-6 task / arkadaş oranı verimlidir (15 bağımsız task için 3 arkadaş)

### 3. Görev boyutlandırması

- **Çok küçük**: Koordinasyon maliyeti > fayda
- **Çok büyük**: Uzun süre check-in olmaz, risk artar
- **İdeal**: Tek bir fonksiyon, test dosyası veya review gibi net çıktı üreten birimler

### 4. Liderin beklemesini sağlayın

Lider bazen takım arkadaşlarını beklemeden kendisi iş yapmaya başlar:

```text
Takım arkadaşlarının görevlerini bitirmesini bekle.
```

### 5. Araştırma ve inceleme ile başlayın

İlk defa kullanıyorsanız, PR review, kütüphane araştırması veya hata incelemesi gibi kod yazmayan görevlerle başlayın.

### 6. Dosya çakışmalarından kaçının

İki arkadaşın aynı dosyayı düzenlemesi üzerine yazmaya (overwrite) yol açar. İşi her arkadaş farklı dosyalarda çalışacak şekilde bölün.

### 7. İzleyin ve yönlendirin

Takımı uzun süre gözetimsiz bırakmayın. İlerlemeyi kontrol edin, yanlış giden yaklaşımları düzeltin.

---

## Kullanım Senaryoları

### 1. Paralel Code Review

```text
PR #142'yi incelemek için bir agent team oluştur. 3 reviewer spawn et:
- Biri güvenlik açıklarına odaklansın
- Biri performans etkisini kontrol etsin
- Biri test coverage'ı doğrulasın
Her biri review yapsın ve bulgularını raporlasın.
```

### 2. Rekabetçi Hipotezlerle Hata Ayıklama

```text
Kullanıcılar uygulamanın bir mesajdan sonra bağlantıyı kestiğini bildiriyor.
5 farklı hipotezi araştırması için takım arkadaşları spawn et.
Birbirlerinin teorilerini çürütmeye çalışsınlar, bilimsel bir tartışma gibi.
Ortaya çıkan konsensusu findings doc'a kaydetsinler.
```

---

## Sorun Giderme

### Takım arkadaşları görünmüyor

- **In-process**: `Shift+↓` ile aktif arkadaşlar arasında geçiş yapın
- Görevin takım gerektirecek kadar karmaşık olup olmadığını kontrol edin
- Split pane için: `which tmux` ile tmux kurulumunu kontrol edin
- iTerm2 için: `it2` CLI ve Python API kontrolü

### Çok fazla izin prompt'u

Ortak işlemleri önceden permission settings'te onaylayın:

```text
Sık kullanılan komutları settings.json'a allow olarak ekle.
```

### Takım arkadaşları hata alınca duruyor

- `Shift+↓` ile çıktıyı kontrol edin
- Direkt talimat verin
- Yedek takım arkadaşı spawn edin

### Lider iş bitmeden kapatıyor

```text
Takım arkadaşlarının işi bitene kadar devam et.
İşi devret, kendin yapmaya başlama.
```

### Yetim tmux session'ları

```bash
tmux ls
tmux kill-session -t <session-name>
```

---

## Limitasyonlar

| Limitasyon | Detay |
|------------|-------|
| **Session kurtarma** | `/resume` ve `/rewind` in-process arkadaşları geri getirmez |
| **Task status gecikmesi** | Arkadaşlar task'i bitirdiği halde güncellemeyi unutabilir |
| **Kapanma yavaşlığı** | Mevcut request/tool call bitene kadar bekler |
| **Tek takım** | Lider aynı anda sadece bir takım yönetebilir |
| **İç içe takım yok** | Takım arkadaşları kendi takımlarını/spawn edemez |
| **Lider sabit** | Lider değiştirilemez, devredilemez |
| **İzinler spawn anında** | Sonradan değiştirilebilir ama spawn'da set edilemez |
| **Split pane** | tmux veya iTerm2 gerektirir (VS Code terminal, Windows Terminal, Ghostty'de çalışmaz) |

### Önemli not

**CLAUDE.md normale çalışır.** Takım arkadaşları CLAUDE.md dosyalarını normal şekilde okur. Projeye özel yönergeleri CLAUDE.md'de tutun.

---

## İleri Okuma

- **Hafif delegasyon**: [Subagents](https://code.claude.com/docs/en/sub-agents) - agent'lar arası iletişim gerekmeyen işler için
- **Manuel paralel session**: [Git worktrees](https://code.claude.com/docs/en/worktrees) - otomasyon olmadan birden çok session
- **Karşılaştırma**: [Subagent vs Agent Team](https://code.claude.com/docs/en/features-overview#compare-similar-features)
