"use client";
import { useState } from "react";
import AddMenuVariant from "@/components/tenant/menu/variant/addMenuVariant";
import AddMenuItem from "@/components/tenant/menu/item/addMenuItem";
import AddMenuBundle from "@/components/tenant/menu/bundle/addMenuBundle";
// import { useTenant } from "@/context/tenantContext";

export default function MenuPage() {
  const [tabAktif, setTabAktif] = useState<'menu' | 'bundle' | 'variant'>('menu');
  // Ganti menuItemId sesuai kebutuhan, misal dari props atau state
  const menuItemId = ""; // TODO: ganti dengan id menu item yang aktif

  return (
    <div className="card card-border bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="tabs tabs-box mb-4">
          <button
            className={`tab${tabAktif === 'menu' ? ' tab-active' : ''}`}
            onClick={() => setTabAktif('menu')}
            type="button"
          >
            Menu
          </button>
          <button
            className={`tab${tabAktif === 'bundle' ? ' tab-active' : ''}`}
            onClick={() => setTabAktif('bundle')}
            type="button"
          >
            Bundle
          </button>
          <button
            className={`tab${tabAktif === 'variant' ? ' tab-active' : ''}`}
            onClick={() => setTabAktif('variant')}
            type="button"
          >
            Varian
          </button>
        </div>
        {tabAktif === 'menu' && <AddMenuItem />}
        {tabAktif === 'bundle' && <AddMenuBundle />}
        {tabAktif === 'variant' && <AddMenuVariant menuItemId={menuItemId} />}
        {/* ...existing konten halaman menu... */}
      </div>
    </div>
  );
}