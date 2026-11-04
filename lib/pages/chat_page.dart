import 'dart:async';
import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart';

class ChatPage extends StatefulWidget {
  final String uid;
  final String username;

  const ChatPage({
    super.key,
    required this.uid,
    required this.username,
  });

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final DatabaseReference _dbRef = FirebaseDatabase.instance.ref();

  // List UID yang memiliki hak akses DEV/Admin
  static const List<String> _devUids = [
    "DEV_XYUREI_OWNER",
    "DEV_CREATOR_DAPP",
    "DEV_ADMIN",
  ];

  bool get _isDev =>
      _devUids.contains(widget.uid) ||
      widget.uid.startsWith("DEV_") ||
      widget.username.toLowerCase().contains("admin") ||
      widget.username.toLowerCase().contains("owner");

  final List<Map<String, dynamic>> _messages = [];
  int _onlineCount = 1;
  bool _isBanned = false;
  DateTime? _lastSentTime;

  StreamSubscription<DatabaseEvent>? _chatSubscription;
  StreamSubscription<DatabaseEvent>? _presenceSubscription;
  StreamSubscription<DatabaseEvent>? _connectedSubscription;
  StreamSubscription<DatabaseEvent>? _banCheckSubscription;

  @override
  void initState() {
    super.initState();
    _checkIfBanned();
    _initPresence();
    _initPublicChatListener();
  }

  @override
  void dispose() {
    _chatSubscription?.cancel();
    _presenceSubscription?.cancel();
    _connectedSubscription?.cancel();
    _banCheckSubscription?.cancel();
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  /// Check jika user ter-ban
  void _checkIfBanned() {
    _banCheckSubscription = _dbRef.child('banned_users/${widget.uid}').onValue.listen((event) {
      if (event.snapshot.exists) {
        final val = event.snapshot.value;
        if (val == true || (val is Map && val['banned'] == true)) {
          if (mounted) {
            setState(() {
              _isBanned = true;
            });
          }
        }
      }
    });
  }

  /// PRESENCE: /presence/{uid}
  void _initPresence() {
    final connectedRef = FirebaseDatabase.instance.ref('.info/connected');

    _connectedSubscription = connectedRef.onValue.listen((event) {
      final isConnected = event.snapshot.value as bool? ?? false;
      if (isConnected) {
        final userPresenceRef = _dbRef.child('presence/${widget.uid}');

        userPresenceRef.onDisconnect().remove();

        userPresenceRef.set({
          'username': widget.username,
          'online': true,
          'lastSeen': ServerValue.timestamp,
        });
      }
    });

    _presenceSubscription = _dbRef.child('presence').onValue.listen((event) {
      if (event.snapshot.exists && event.snapshot.value is Map) {
        final Map presenceMap = event.snapshot.value as Map;
        if (mounted) {
          setState(() {
            _onlineCount = presenceMap.length;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _onlineCount = 1;
          });
        }
      }
    });
  }

  /// LISTENER PUBLIK: /global_chat/messages
  void _initPublicChatListener() {
    final query = _dbRef
        .child('global_chat/messages')
        .orderByChild('timestamp')
        .limitToLast(100);

    _chatSubscription = query.onValue.listen((event) {
      if (event.snapshot.exists && event.snapshot.value is Map) {
        final Map rawMap = event.snapshot.value as Map;
        final List<Map<String, dynamic>> loaded = [];

        rawMap.forEach((key, value) {
          if (value is Map) {
            loaded.add({
              'id': key.toString(),
              'uid': value['uid']?.toString() ?? '',
              'username': value['username']?.toString() ?? 'Anonymous',
              'text': value['text']?.toString() ?? '',
              'timestamp': value['timestamp'] is int ? value['timestamp'] : 0,
            });
          }
        });

        loaded.sort((a, b) => (a['timestamp'] as int).compareTo(b['timestamp'] as int));

        if (mounted) {
          setState(() {
            _messages
              ..clear()
              ..addAll(loaded);
          });
          _scrollToBottom();
        }
      } else {
        if (mounted) {
          setState(() {
            _messages.clear();
          });
        }
      }
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  /// Action BANNED USER (Khusus DEV)
  void _banUser(String targetUid, String targetUsername) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1B2A41),
        title: const Text("Konfirmasi BAN", style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
        content: Text("Apakah Anda yakin ingin membanned user '$targetUsername' ($targetUid) secara permanen?", style: const TextStyle(color: Colors.white70)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Batal", style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () async {
              Navigator.pop(ctx);
              await _dbRef.child('banned_users/$targetUid').set({
                'banned': true,
                'bannedBy': widget.username,
                'reason': 'Banned by Admin',
                'bannedAt': ServerValue.timestamp,
              });
              if (!mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text("User $targetUsername telah ter-BAN permanen!")),
              );
            },
            child: const Text("BAN PERMANEN", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  /// KIRIM PESAN: Simpan ke SINGLE PATH /global_chat/messages/{pushId}
  void _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    // Cek jika ter-ban
    if (_isBanned) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          backgroundColor: const Color(0xFF1B2A41),
          title: const Text("AKUN TER-BAN", style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
          content: const Text("Lu di-banned permanen oleh Admin.", style: TextStyle(color: Colors.white)),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("OK", style: TextStyle(color: Color(0xFF00D4FF))),
            ),
          ],
        ),
      );
      return;
    }

    // Anti-spam 3 detik cooldown
    final now = DateTime.now();
    if (_lastSentTime != null && now.difference(_lastSentTime!).inSeconds < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Slow mode 3 detik"),
          duration: Duration(seconds: 1),
        ),
      );
      return;
    }

    try {
      _lastSentTime = now;
      await _dbRef.child('global_chat/messages').push().set({
        'uid': widget.uid,
        'username': widget.username,
        'text': text,
        'timestamp': ServerValue.timestamp,
      });

      _messageController.clear();
      _scrollToBottom();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal mengirim pesan: $e')),
      );
    }
  }

  Color _getUsernameColor(String name) {
    final hash = name.codeUnits.fold(0, (prev, elem) => prev + elem);
    const colors = [
      Color(0xFF00D4FF),
      Color(0xFFA6FF00),
      Color(0xFFFF007F),
      Color(0xFFFFB703),
      Color(0xFF9D4EDD),
      Color(0xFF00F5D4),
    ];
    return colors[hash % colors.length];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1B2A41),
        elevation: 0,
        title: Row(
          children: [
            const Text(
              "DAPP GLOBAL CHAT",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
                color: Colors.white,
              ),
            ),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black38,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFA6FF00).withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: Color(0xFFA6FF00),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    "$_onlineCount Online",
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFFA6FF00),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _messages.isEmpty
                ? const Center(
                    child: Text(
                      "Belum ada pesan.\nKirim pesan pertama sekarang!",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white38, fontSize: 13),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final msg = _messages[index];
                      final bool isMe = msg['uid'] == widget.uid;
                      final userColor = _getUsernameColor(msg['username']);

                      return Container(
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                        child: Column(
                          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                if (!isMe)
                                  Padding(
                                    padding: const EdgeInsets.only(left: 8, bottom: 3),
                                    child: Text(
                                      msg['username'],
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: userColor,
                                      ),
                                    ),
                                  ),
                                
                                // Tombol BAN khusus jika current user adalah DEV/Admin & bukan pesan sendiri
                                if (_isDev && !isMe) ...[
                                  const SizedBox(width: 8),
                                  GestureDetector(
                                    onTap: () => _banUser(msg['uid'], msg['username']),
                                    child: Container(
                                      margin: const EdgeInsets.only(bottom: 3),
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: Colors.redAccent.withOpacity(0.25),
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(color: Colors.redAccent, width: 0.8),
                                      ),
                                      child: const Text(
                                        "BAN",
                                        style: TextStyle(
                                          color: Colors.redAccent,
                                          fontSize: 9,
                                          fontWeight: FontWeight.black,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                              constraints: BoxConstraints(
                                maxWidth: MediaQuery.of(context).size.width * 0.75,
                              ),
                              decoration: BoxDecoration(
                                color: isMe ? const Color(0xFF00D4FF) : const Color(0xFF1B2A41),
                                borderRadius: BorderRadius.circular(18),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.18),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: Text(
                                msg['text'],
                                style: TextStyle(
                                  color: isMe ? Colors.black : Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            color: const Color(0xFF1B2A41),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      maxLength: 200,
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        hintText: _isBanned ? "Anda dalam status BAN PERMANEN" : "Ketik pesan global...",
                        hintStyle: TextStyle(color: _isBanned ? Colors.redAccent : Colors.white38),
                        enabled: !_isBanned,
                        filled: true,
                        fillColor: const Color(0xFF0D1B2A),
                        counterText: "",
                        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(28),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _sendMessage,
                    child: Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: _isBanned ? Colors.grey : const Color(0xFF00D4FF),
                        shape: BoxShape.circle,
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x6600D4FF),
                            blurRadius: 10,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.black, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
