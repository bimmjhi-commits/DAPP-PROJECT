import 'dart:ui';
import 'package:flutter/material.dart';

class ToolsPage extends StatelessWidget {
  const ToolsPage({super.key});

  // 20 Dummy Tools Data DAPP PROJECT
  static final List<Map<String, dynamic>> _tools = [
    {"title": "TIKTOK DL", "sub": "No Watermark HD", "icon": Icons.download_rounded},
    {"title": "IG REELS DL", "sub": "Instagram Media", "icon": Icons.video_camera_back_rounded},
    {"title": "YT DOWNLOADER", "sub": "MP3 & MP4 4K", "icon": Icons.play_circle_fill_rounded},
    {"title": "FB VIDEO DL", "sub": "High Quality Post", "icon": Icons.share_rounded},
    {"title": "TWITTER MEDIA", "sub": "Save Tweet Clips", "icon": Icons.flutter_dash_rounded},
    {"title": "BRAT GENERATOR", "sub": "Aesthetic Text Art", "icon": Icons.auto_awesome_rounded},
    {"title": "SERTIFIKAT TOLOL", "sub": "Fun Certificate", "icon": Icons.workspace_premium_rounded},
    {"title": "QR GENERATOR", "sub": "Custom Barcode", "icon": Icons.qr_code_2_rounded},
    {"title": "REMOVE BG", "sub": "AI Cutout Tool", "icon": Icons.layers_clear_rounded},
    {"title": "AI ENHANCE", "sub": "Photo Upscaler", "icon": Icons.auto_fix_high_rounded},
    {"title": "IG STALKER", "sub": "Profile Recon", "icon": Icons.person_search_rounded},
    {"title": "TIKTOK STALKER", "sub": "Inspect Account", "icon": Icons.search_rounded},
    {"title": "TANYA USTADZ", "sub": "Islamic Knowledge", "icon": Icons.menu_book_rounded},
    {"title": "WINDOWS QUOTES", "sub": "Retro Dialogue", "icon": Icons.web_asset_rounded},
    {"title": "FAKE IG CHAT", "sub": "DM Screen Mockup", "icon": Icons.chat_bubble_outline_rounded},
    {"title": "BRAT VIDEO", "sub": "Green Screen Clip", "icon": Icons.videocam_rounded},
    {"title": "DISTRACTED BOY", "sub": "Meme Generator", "icon": Icons.visibility_rounded},
    {"title": "DOGE CHEEMS", "sub": "Classic Meme Kit", "icon": Icons.mood_rounded},
    {"title": "SUB4UNLOCK", "sub": "Shortlink Bypass", "icon": Icons.lock_open_rounded},
    {"title": "OSINT RECON", "sub": "Cyber Terminal", "icon": Icons.terminal_rounded},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: ClipRRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
            child: AppBar(
              backgroundColor: Colors.transparent,
              elevation: 0,
              centerTitle: true,
              title: const Text(
                "DAPP TOOLS",
                style: TextStyle(
                  fontFamily: 'MadeEvolveSansEvo',
                  fontFamilyFallback: ['Space Grotesk', 'sans-serif'],
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                  fontSize: 18,
                ),
              ),
              iconTheme: const IconThemeData(color: Colors.white),
            ),
          ),
        ),
      ),
      body: Stack(
        children: [
          // 1. Background Image
          Positioned.fill(
            child: Image.network(
              'https://images.unsplash.com/photo-1519681393784-d120267933ba',
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: const Color(0xFF0D1B2A)),
            ),
          ),

          // 2. Dark Overlay #0D1B2A with 0.65 Opacity
          Positioned.fill(
            child: Container(
              color: const Color(0xFF0D1B2A).withOpacity(0.65),
            ),
          ),

          // 3. Grid 2 Columns Glass Cards
          SafeArea(
            child: GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: _tools.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.45,
              ),
              itemBuilder: (context, index) {
                final tool = _tools[index];
                return GlassCard(
                  title: tool['title'] as String,
                  subtitle: tool['sub'] as String,
                  icon: tool['icon'] as IconData,
                  onTap: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text("Membuka ${tool['title']}..."),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

/// Reusable GlassCard Widget
class GlassCard extends StatefulWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  const GlassCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });

  @override
  State<GlassCard> createState() => _GlassCardState();
}

class _GlassCardState extends State<GlassCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedScale(
        scale: _isPressed ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeInOut,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(_isPressed ? 0.14 : 0.08),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.white.withOpacity(0.15),
                  width: 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              child: Row(
                children: [
                  // Icon #00D4FF dengan Efek Glow
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: const Color(0xFF00D4FF).withOpacity(0.15),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF00D4FF).withOpacity(0.35),
                          blurRadius: 10,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: Icon(
                      widget.icon,
                      color: const Color(0xFF00D4FF),
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Teks Judul dan Subtitle
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          widget.title,
                          style: const TextStyle(
                            fontFamily: 'MadeEvolveSansEvo',
                            fontFamilyFallback: ['Space Grotesk', 'sans-serif'],
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 12.5,
                            letterSpacing: 0.5,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 3),
                        Text(
                          widget.subtitle,
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontFamilyFallback: const ['sans-serif'],
                            color: Colors.white.withOpacity(0.7),
                            fontSize: 10.5,
                            fontWeight: FontWeight.w400,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
