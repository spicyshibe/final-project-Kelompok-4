import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [nama, setNama] = useState(user?.nama || '');
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [confirmPasswordBaru, setConfirmPasswordBaru] = useState('');

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!nama.trim()) {
      setStatus({ type: 'error', message: 'Nama tidak boleh kosong.' });
      return;
    }

    if (passwordBaru) {
      if (!passwordLama) {
        setStatus({ type: 'error', message: 'Masukkan password saat ini untuk konfirmasi pengubahan password.' });
        return;
      }
      if (passwordBaru.length < 6) {
        setStatus({ type: 'error', message: 'Password baru minimal 6 karakter.' });
        return;
      }
      if (passwordBaru !== confirmPasswordBaru) {
        setStatus({ type: 'error', message: 'Konfirmasi password baru tidak cocok.' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        nama: nama.trim(),
        passwordLama: passwordLama || undefined,
        passwordBaru: passwordBaru || undefined,
      });

      setStatus({ type: 'success', message: 'Profil dan pengaturan berhasil diperbarui!' });
      setPasswordLama('');
      setPasswordBaru('');
      setConfirmPasswordBaru('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Gagal memperbarui profil.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun & Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi data diri dan kata sandi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Account Summary Card */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-md">
              {user?.nama?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user?.nama}</h2>
            <p className="text-xs text-gray-500 mb-3">{user?.email}</p>
            
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.role === 'admin' ? 'Administrator' : 'Pelanggan'}
            </span>

            <div className="mt-6 pt-6 border-t border-gray-100 text-left text-xs text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>User ID:</span>
                <span className="font-mono font-medium text-gray-700">#{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Bergabung:</span>
                <span className="text-gray-700">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                  Informasi Dasar
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Alamat Email (Tidak dapat diubah)
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">
                  Ganti Password
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Kosongkan bagian ini jika Anda tidak ingin mengubah password akun Anda.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={passwordLama}
                        onChange={(e) => setPasswordLama(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Password Baru
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={passwordBaru}
                          onChange={(e) => setPasswordBaru(e.target.value)}
                          placeholder="Min. 6 karakter"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Ulangi Password Baru
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          value={confirmPasswordBaru}
                          onChange={(e) => setConfirmPasswordBaru(e.target.value)}
                          placeholder="Ulangi password baru"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
