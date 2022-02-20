import React, {useMemo, useState, useEffect} from 'react'

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate'; //Após a importação eu coloco essa variavel no useEffect para formatar a data.

import{ Container, Content, Filters } from './styles';

interface IRouteParams {
    match: {
        params: {
            type: string; //É um type, pois no arquivos de rotas também coloquei type.
        }
    }
}

interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC<IRouteParams> = ({ match }) => { //No caso do return, dentro do useMemo, eu preciso pegar o tipo do URL, no caso desse tipo ele vem dos parametros da rota. Como ele vem dos parametros da rota, agente pode vir aqui e colocar como parametro da nossa lista, um cara chamado match, esse match esta disponivel graças ao react router dom. Porque o nosso lista vem dentro do Route path, do arquivo Routes. Esse cara esta dentro de um switch e dentro de um layout, que devolve o nosso AppRoutes  para  nosso index, que esta dento do browserRouter. o browser router disponibiliza pra gente esse match, que ele vai conter os parametros que tem na rota "URL". Porem, para ser usada, é necessário criar uma interface.
    const [data, setData] = useState<IData[]>([]); //Qual é a estrutura do useState? O useState é um array que na primeira posição "data", ele guarda o valor do estado e na seunda posição ele tem uma função que atualiza o valor do estado; ja nos colchetes do useState, conseguimos atribuir um valor inicial. Porém é legal nós criamos uma interface para dizer quais valores/informações agente vai lidar com  esse "data".Depois de criar o interface, eu coloco os simbolos de menor e passo a interface depois fecho com o simbolo de maior.

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));//Nesse estado eu guardo o mes selecionado no filtro. //(String(new Date().getMonth() +1)), serve para que toda a vez que iniciarmos a lista ele mostre o mês atual.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear())); //Nesse estado eu guardo o ano selecionado no filtro. //(String(new Date().getFullYear())), serve para que toda a vez que iniciarmos a lista ele mostre o ano atual.

    const { type } = match.params;

    const title = useMemo(() => { //Use memo memoriza valores. Trata-se de uma função anonima; na hora que bate no useMemo, ele ja vai disparar o conteudo da função automáticamente. Entre as chaves é o que agente quer fazer e colchete agente pode colocar um parametro, ou seja, agente pode definir assim: -Eu quero que esse cara atualize sempre quando tal coisa mudar". No nosso caso, vamos colocar a mudança da rota no url. Então quando a rota mudar, eu vou querer que mude o title do ContentHeader. Ainda sobre os colchetes vazios, o que agente colocar nele de constante ou varivel, se mudar, vai gerar uma nova renderização do title, graças ao useMemo; que fica escutando se o um determinado valor mudou.
        return type === 'entry-balance' ? 'Entradas' : 'Saídas'//Operador Ternário
    },[type]); //Se eu colocar colchetes, sem nada, ele executa uma unica vez. Se eu passar o type no caso, eu estou criando uma dependencia.


    const lineColor = useMemo(() => { //Não esta funcionando 19/02/2022 - Rafael
        return type === 'entry-balance' ? '#F7931B' : '#E44C4E' //Operador Ternário
    },[type]); //Agora vamos mudar a cor do subinhado a medida que eu mudar as telas.
    //Se eu colocar colchete vazio, sem nada, ele executa uma unica vez. Se eu passar o type no caso, eu estou criando uma dependencia.
    
    const listData = useMemo(() => { 
        return type === 'entry-balance' ? gains : expenses; //Operador Ternário
    },[type]);
    

    const months = [
        {value: 1, label: 'Janeiro'},
        {value: 5, label: 'Maio'},
        {value: 7, label: 'Julho'},
    ]
    const years = [
        {value: 2019, label: 2019},
        {value: 2018, label: 2018},
        {value: 2020, label: 2020},
    ]

    useEffect(() => {
        //Muito parecido com o useMemo, porém com a diferença que ele é disparado toda a vez que atela é carregada.
        const filteredData = listData.filter(item => { //Vou fazer um map no listData. E para cada item eu vou devolver com o return e vou copiar o formato que ele esta esperando do interface, conforme abaixo:

            //Fazendo a função de filtro. Primeiramente vou mudar de map para filter. Vou mudar para filter pois quero filtrar pelos valores que tem a mesma data e ano que estiver selecionado.
            const date = new Date(item.date); //Primeiramente vou pegar os numero dos dados mockados da pasta repositories e vou tratar esses dados; vou converter eles em data.
            const month = String(date.getMonth() + 1); //Para facilitar, vou deixar separado; //Para igualar com o retorno da função month === monthSelected, vou converter esse dado em string;
            const year = String(date.getFullYear()); //Para igualar com o retorno da função year === yearSelected, vou converter esse dado em string;

            return month === monthSelected && year === yearSelected; //ou seja, eu vou retornar as tarefas que possuem o mês igual ao mês slecionado, e o ano selecionado.
        }); //Portanto primeiro eu filtrei pelo mês e ano.

        //Agora eu tenho que percorrer ele para formatar;
        const formattedData = filteredData.map(item => { 
            return {
                id: String(new Date().getTime()) + item.amount, //Para gerar numeros diferentes com o (new Date().getTime() + item.amount); uma combinação de dois itens para gerar ID's diferentes. //String(Math.random() * data.length), era assim. Para criar um ID para o map abaixo, vou usar uma função do java script chamada math.random. Eu vu pedir pra ele criar pra mim um numero aleatório dentro da numeração do tamanho da nossa lista. Se alista tiver 49 itens, o random vai criar 49 id's. 
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate(item.date), // Conforme arquivo formatDate.ts;
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E',
            }
        })
    setData(formattedData); //Portanto depois eu pego e devolvo os valores formatados.        
    },[listData, monthSelected, yearSelected, data.length]);//Se não colocarmos nada nos colchetes, ele é disparado somente 1 vez. Se colocarmos uma constante ou variavel nos colchetes, ele sempre vai recarregar/renderizar se o valor que agente colocar nos colchetes mudar.


    //DefaultValue no return do SelectInput, faz parte da lógica de que quando eu recarregar a pagina, ele sempre mostre o valor doano padrão.

    return (
        <Container>
            <ContentHeader title={title} lineColor={lineColor}>
               <SelectInput options={months} onChange={(e) => setMonthSelected(e.target.value)} defaultValue={monthSelected}/> 
               <SelectInput options={years} onChange={(e) => setYearSelected(e.target.value)} defaultValue={yearSelected}/> 
            </ContentHeader>

            <Filters>
                <button 
                type="button"
                className="tag-filter tag-filter-recurrent"
                >
                    Recorrentes
                </button>
                <button 
                type="button"
                className="tag-filter tag-filter-eventual"
                >
                    Eventuais
                </button>
            </Filters>


            <Content> 
                {
                    data.map(item => (
                    <HistoryFinanceCard
                        key={item.id}
                        tagColor={item.tagColor}
                        title={item.description}
                        subtitle={item.dateFormatted}
                        amount={item.amountFormatted}
                    />
                    ))
                }
            </Content>
        </Container>
    );
}

export default List