import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type ModalErrorLoginAdminProps = {
    setShowModal: (value: boolean) => void
    router: AppRouterInstance
}

export const ModalErrorLoginAdmin = ({setShowModal, router}:ModalErrorLoginAdminProps) => {

    
    

    return(

        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-300 scale-100 animate-fadeIn">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-zinc-50">Erro</h3>
            </div>
            <p className="text-zinc-50/80 mb-6">Senha incorreta! Por favor, tente novamente.</p>
            <div className="flex justify-between">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-zinc-500 cursor-pointer text-white rounded hover:bg-zinc-600 transition-all duration-200"
              >
                Voltar ao Menu
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition-all duration-200"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>

    )
}

